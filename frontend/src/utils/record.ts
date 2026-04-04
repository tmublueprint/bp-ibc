/*
Note: The term "Record" here refers to a snapshot of an HTML element's text content
and data styling updates attribute at the time of latest published page version.
*/

type RecordData = {
    id: string,
    textRecord: string,
    styleRecord: string
}

/**
 * If the element doesn't have a Record, add Records for both text content and styling.
 * @param element - The HTML element to be given a Record.
 */
export function addRecord(element: HTMLElement): void {
  if (!element.hasAttribute("text-record")){
    element.setAttribute("text-record", element.innerText);
    element.setAttribute("style-record", element.getAttribute("data-styling-updates") ?? "[]");
  }
}


/**
 * Determines if an element is edited (either the values of its current text content or styling is different
 * from the values timestamped on its Record) or not.
 * - If it is edited, highlight the element.
 * - If it isn't edited, remove highlighting on the element.
 * - If it doesn't have Records, add Records to the element.
 * @param element - The HTML element to be checked and highlighted.
 */
export function highlightIfEdited(element: HTMLElement): void {
  if (!(element.hasAttribute("text-record") && element.hasAttribute("style-record"))){
    addRecord(element);
    return;
  }

  const textContent: string = element.innerText;
  const textRecord: string = element.getAttribute("text-record") ?? "";
  const styleContent: string = element.getAttribute("data-styling-updates") ?? "[]";
  const styleRecord: string = element.getAttribute("style-record") ?? "";

  const elementIsDifferentFromRecord = !(textContent === textRecord && (styleContent === styleRecord || ["", "[]"].includes(styleContent) && ["", "[]"].includes(styleRecord)));

  if (elementIsDifferentFromRecord){
    element.classList.add("edited-not-published-yet");
  }
  else {
    element.classList.remove("edited-not-published-yet");
  }
}


/**
 * Removes all highlighting and Records for edited elements.
 * Also removes the information about Records stored in local storage.
 */
export function removeAllHighlightingForEditedElements(): void {
  document.querySelectorAll(".edited-not-published-yet").forEach(element => {
	  element.classList.remove("edited-not-published-yet");
    element.removeAttribute("text-record");
    element.removeAttribute("style-record");
  });

  localStorage.removeItem("bp-ibc:autosave:records");
}


/**
 * Saves the following information about edited elements in local storage:
 * - The element's id.
 * - The Record for text content.
 * - The Record for text styling.
 * 
 * This information is referenced for loadRecordsFromLocalStorage.
 * 
 * Logs an error if local storage's capacity is exceeded.
*/
export function saveRecordsInLocalStorage(): void {
  const records: Array<RecordData> = [];

  document.querySelectorAll(".edited-not-published-yet").forEach(element => {
    const data: RecordData = {
      id: element.getAttribute("data-editable-id") ?? '',
      textRecord: element.getAttribute("text-record") ?? "",
      styleRecord: element.getAttribute("style-record") ?? "[]"
    };

    records.push(data);
  });

  if (records.length > 0){
    try {
      localStorage.setItem("bp-ibc:autosave:records", JSON.stringify(records));
    }
    catch (error: unknown) {
      if (error instanceof Error && error.name === 'QuotaExceededError'){
        console.error('Local storage exceeded!');
      }
    }
  }
}


/**
 * Reads the information about Records stored in local storage by saveRecordsInLocalStorage,
 * and reapplies the attributes for the corresponding elements' Records.
 * Then highlights any edited elements.
 * 
 * Logs an error if the information failed to be parsed correctly.
 */
export function loadRecordsFromLocalStorage(): void {
  const rawRecords: string | null = localStorage.getItem("bp-ibc:autosave:records");

  if (!rawRecords){
    return;
  }

  let parsedRecords: Array<RecordData> = [];

  try {
    parsedRecords = JSON.parse(rawRecords);
  }
  catch {
    console.error("Failed to interpret Record information from local storage.");
  }

  parsedRecords.forEach((recordData: RecordData) => {
    const element: HTMLElement | null = document.querySelector(`[data-editable-id='${recordData.id}']`);
    element?.setAttribute("text-record", recordData.textRecord);
    element?.setAttribute("style-record", recordData.styleRecord);
    if (element) highlightIfEdited(element);
  });
}