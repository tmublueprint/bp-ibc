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

    if (element.getAttribute("text-timestamp") == element.innerText &&
    element.getAttribute("style-timestamp") == (element.getAttribute("data-styling-updates") ?? "[]")){
        element.classList.remove("edited-not-published-yet");
    }
    else {
        element.classList.add("edited-not-published-yet");
    }
}


export function removeAllHighlightingForEditedElements(): void {
    document.querySelectorAll(".edited-not-published-yet").forEach(element => {
	    element.classList.remove("edited-not-published-yet");
        element.removeAttribute("text-timestamp");
        element.removeAttribute("style-timestamp");
    });

    // NOTE FOR LATER: When working with autosave, clear the information in there as well
}