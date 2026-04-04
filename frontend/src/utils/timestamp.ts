type TimestampData = {
    id: string,
    textTimestamp: string,
    styleTimestamp: string
}


export function addTimestamp(element: HTMLElement): void {
  if (!element.hasAttribute("text-timestamp")){
    element.setAttribute("text-timestamp", element.innerText);
    element.setAttribute("style-timestamp", element.getAttribute("data-styling-updates") ?? "[]");
  }
}


export function highlightIfEdited(element: HTMLElement): void {
  if (!(element.hasAttribute("text-timestamp") && element.hasAttribute("style-timestamp"))){
    addTimestamp(element);
    return;
  }

  const elementIsDifferentFromTimestamp = !(element.getAttribute("text-timestamp") == element.innerText && [element.getAttribute("style-timestamp"), "", "[]"].includes((element.getAttribute("data-styling-updates") ?? "")));

  if (elementIsDifferentFromTimestamp){
    element.classList.add("edited-not-published-yet");
  }
  else {
    element.classList.remove("edited-not-published-yet");
  }
}


export function removeAllHighlightingForEditedElements(): void {
  document.querySelectorAll(".edited-not-published-yet").forEach(element => {
	  element.classList.remove("edited-not-published-yet");
    element.removeAttribute("text-timestamp");
    element.removeAttribute("style-timestamp");
  });

  localStorage.removeItem("bp-ibc:autosave:timestamps");
}


export function saveTimestampsInLocalStorage(): void {
  const timestamps: Array<TimestampData> = [];

  document.querySelectorAll(".edited-not-published-yet").forEach(element => {
    const data: TimestampData = {
      id: element.getAttribute("data-editable-id") ?? '',
      textTimestamp: element.getAttribute("text-timestamp") ?? "",
      styleTimestamp: element.getAttribute("style-timestamp") ?? "[]"
    };

    timestamps.push(data);
  });

  if (timestamps.length > 0){
    try {
      localStorage.setItem("bp-ibc:autosave:timestamps", JSON.stringify(timestamps));
    }
    catch (error: unknown) {
      if (error instanceof Error && error.name === 'QuotaExceededError'){
        console.error('Local storage exceeded!');
      }
    }
  }
}


export function loadTimestampsFromLocalStorage(): void {
  const rawTimestamps: string | null = localStorage.getItem("bp-ibc:autosave:timestamps");

  if (!rawTimestamps){
    return;
  }

  let parsedTimestamps = [];

  try {
    parsedTimestamps = JSON.parse(rawTimestamps);
  }
  catch {
    console.error("Failed to interpret timestamp information from local storage.");
  }

  parsedTimestamps.forEach((timestampData: TimestampData) => {
    const element: HTMLElement | null = document.querySelector(`[data-editable-id='${timestampData.id}']`);
    element?.setAttribute("text-timestamp", timestampData.textTimestamp);
    element?.setAttribute("style-timestamp", timestampData.styleTimestamp);
    if (element) highlightIfEdited(element);
  });
}