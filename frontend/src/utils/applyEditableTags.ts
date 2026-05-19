const BLOCKED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'SVG',
  'PATH',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
]);

const EDITABLE_ID_ATTRIBUTE = 'data-editable-id';

function getElementPath(element: HTMLElement, root: HTMLElement) {
  const segments: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== root) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) {
      break;
    }

    const siblings = Array.from(parent.children).filter(
      (child): child is Element => (child as Element).tagName === current?.tagName
    );
    const index = siblings.indexOf(current);
    segments.unshift(`${current.tagName.toLowerCase()}:${index}`);
    current = parent;
  }

  return segments.join('/');
}

function ensureEditableId(element: HTMLElement, root: HTMLElement) {
  if (!element.hasAttribute(EDITABLE_ID_ATTRIBUTE)) {
    const path = getElementPath(element, root);
    if (path) {
      element.setAttribute(EDITABLE_ID_ATTRIBUTE, path);
    }
  }
}

export function applyEditableTags(root: HTMLElement = document.body) {
  const autoEditableSpans = Array.from(
    root.querySelectorAll('span[data-editable="true"]')
  );

  autoEditableSpans.forEach((span) => {
    const attributes = Array.from(span.attributes).map((attr) => attr.name);
    const allowedAttributes = new Set(['data-editable', 'data-editable-scope']);
    const hasOnlyAllowed = attributes.every((attr) => allowedAttributes.has(attr));

    if (hasOnlyAllowed && span.childElementCount === 0) {
      span.replaceWith(document.createTextNode(span.textContent ?? ''));
    }
  });

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (BLOCKED_TAGS.has(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.closest('[data-editable="true"]')) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.childElementCount > 0) {
          // Void/decorative elements (BR, IMG, SVG) hold no text and shouldn't
          // prevent sibling text nodes from being made editable
          const VOID_TAGS = new Set(['BR', 'IMG', 'SVG']);
          const hasBlockingChildren = Array.from(parent.children).some(
            child => !VOID_TAGS.has((child as Element).tagName)
          );
          if (hasBlockingChildren) return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const parent = textNode.parentElement;
    if (!parent) {
      return;
    }

    if (parent.tagName === 'BUTTON') {
      // Make a span editable inside the button rather than the button itself.
      // contentEditable on a <button> causes Space to fire a click instead of
      // inserting a character, and Backspace behaves erratically.
      const span = document.createElement('span');
      parent.replaceChild(span, textNode);
      span.appendChild(textNode);
      span.setAttribute('data-editable', 'true');
      span.setAttribute('data-editable-leaf', 'true');
      ensureEditableId(span, root);
    } else {
      parent.setAttribute('data-editable', 'true');
      parent.setAttribute('data-editable-leaf', 'true');
      ensureEditableId(parent, root);
    }
  });

  const editableElements = Array.from(
    root.querySelectorAll<HTMLElement>('[data-editable="true"]')
  );

  editableElements.forEach((element) => {
    if (element.childElementCount === 0) {
      element.setAttribute('data-editable-leaf', 'true');
    }

    ensureEditableId(element, root);
  });

  return editableElements.length;
}

export function isSharedComponent(element: HTMLElement): boolean {
  // Check if element is inside a shared component like Navbar or Footer
  const sharedSelectors = ['nav', 'footer'];
  for (const selector of sharedSelectors) {
    if (element.closest(selector)) {
      return true;
    }
  }
  return false;
}

export function disableEditorLinks(_root: HTMLElement = document.body) {
  // No-op: link blocking is handled via onClickCapture on the canvas div in EditPages
}

