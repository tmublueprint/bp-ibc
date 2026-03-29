export type DbEditableElement = {
  id: string;
  text: string;
};

export type DbPageLike = {
  id?: string;
  page_number?: number;
  page_name?: string;
  editable_elements?: unknown;
  content?: unknown;
  elements?: unknown;
  [key: string]: unknown;
};

export type ContentDifference = {
  id: string;
  currentText: string;
  nextText: string;
};

export type SyncResult = {
  differences: ContentDifference[];
  appliedCount: number;
};

function normalizeEditableElement(entry: unknown): DbEditableElement | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const value = entry as Record<string, unknown>;
  const candidateId =
    value.id ?? value.db_id ?? value.dbId ?? value.editable_id ?? value.editableId ?? value.key;
  const candidateText = value.text ?? value.content ?? value.value;

  if (typeof candidateId !== 'string' || !candidateId.trim()) {
    return null;
  }

  if (typeof candidateText !== 'string') {
    return null;
  }

  return {
    id: candidateId,
    text: candidateText,
  };
}

function extractEditableElements(page: DbPageLike): DbEditableElement[] {
  const candidates = [page.editable_elements, page.content, page.elements];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const normalized = candidate
      .map(normalizeEditableElement)
      .filter((value): value is DbEditableElement => value !== null);

    if (normalized.length) {
      return normalized;
    }
  }

  return [];
}

function resolveCurrentPage(pages: DbPageLike[], root: HTMLElement): DbPageLike | null {
  const rootWithId = root.querySelector<HTMLElement>('[data-id]');
  const currentPageId = rootWithId?.getAttribute('data-id');

  if (!currentPageId) {
    return pages[0] ?? null;
  }

  const numericPageId = Number(currentPageId);
  const pageMatchByNumber = pages.find(
    (page) => typeof page.page_number === 'number' && page.page_number === numericPageId
  );

  if (pageMatchByNumber) {
    return pageMatchByNumber;
  }

  return pages.find((page) => page.id === currentPageId) ?? pages[0] ?? null;
}

export function compareTemplateToPageContent(root: HTMLElement, page: DbPageLike): ContentDifference[] {
  const dbElements = extractEditableElements(page);

  if (!dbElements.length) {
    return [];
  }

  const editableElements = Array.from(
    root.querySelectorAll<HTMLElement>('[data-editable][data-editable-leaf="true"]')
  );

  const domById = new Map(
    editableElements
      .map((element) => [element.getAttribute('data-editable-id') ?? '', element] as const)
      .filter(([id]) => Boolean(id))
  );

  const differences: ContentDifference[] = [];

  dbElements.forEach((dbElement) => {
    const target = domById.get(dbElement.id);
    if (!target) {
      return;
    }

    const currentText = target.textContent ?? '';
    if (currentText === dbElement.text) {
      return;
    }

    differences.push({
      id: dbElement.id,
      currentText,
      nextText: dbElement.text,
    });
  });

  return differences;
}

export function applyContentDifferences(root: HTMLElement, differences: ContentDifference[]): number {
  if (!differences.length) {
    return 0;
  }

  let appliedCount = 0;

  differences.forEach((difference) => {
    const target = root.querySelector<HTMLElement>(
      `[data-editable][data-editable-leaf="true"][data-editable-id="${CSS.escape(difference.id)}"]`
    );

    if (!target) {
      return;
    }

    target.textContent = difference.nextText;
    appliedCount += 1;
  });

  return appliedCount;
}

export function syncTemplateWithPublishedPages(root: HTMLElement, pages: DbPageLike[]): SyncResult {
  const currentPage = resolveCurrentPage(pages, root);

  if (!currentPage) {
    return {
      differences: [],
      appliedCount: 0,
    };
  }

  const differences = compareTemplateToPageContent(root, currentPage);
  const appliedCount = applyContentDifferences(root, differences);

  return {
    differences,
    appliedCount,
  };
}
