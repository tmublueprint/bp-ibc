import React, { useEffect, useRef, useContext, useState } from "react";
import "./TextSettingStyle.css";
import { UIContext } from "../../context/UIContext";
import { FontEnum } from "../../enum/fontEnum";
import SaveButton from "../save/SaveButton";

interface TextSettingPopupUIProps {
  content: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

function TextSettingPopupUIComponent({
  position,
  onClose,
}: TextSettingPopupUIProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const updatesRef = useRef<Update[]>([]);
  const uiContext = useContext(UIContext);
  const state = uiContext?.state;

  if (!state) return;
  const element = state.selectedElement;

  // states
  const [fontWeight, setFontWeight] = useState(
    element ? Number(window.getComputedStyle(element).fontWeight) : 400,
  ); // font weight / bold
  const [fontSize, setFontSize] = useState(
    element
      ? parseFloat(window.getComputedStyle(element).fontSize)
      : Number(12),
  ); // font size
  const [alignment, setAlignmentState] = useState(
    element ? window.getComputedStyle(element).textAlign : "left",
  ); // text alignment

  const OFFVAL = "0"; // constant because not sure if "0" or "-1" is better for off, needs to be a string to hold value (ex. bold 700)

  const stylingTypes = [
    "bold",
    "italic",
    "underline",
    "strike",
    "fontFamily",
    "fontSize",
  ]; // everything should depend on this
  const isInvertible = ["bold", "italic", "underline", "strike"];
  const propertyToType: Record<string, string | undefined> = {
    // this can be refactored out.
    "font-weight": "bold",
    "font-style": "italic",
    "text-decoration-line": "underline",
    "font-family": "fontFamily",
    "font-size": "fontSize",
    strike: "strike",
  };

  class Update {
    idx: number;
    style: string;
    val: string | undefined | null;
    constructor(idx: number, style: string, val?: string) {
      this.idx = idx;
      this.style = style;
      this.val = val;
    }
  }

  // Inserts an update, and shouldn't insert any redundant updates.
  // TODO: Improve by using binary search instead of linear search later, also refactor the whole thing. Control structure sucks right now
  function insertUpdate(
    start: number,
    end: number,
    style: string,
    val: string,
    updates: Update[],
  ) {
    // console.log("insertUpdate called with: ", start, end, style, val, updates);
    let started = false,
      ended = false;
    let endVal = OFFVAL;
    let endValid = false; // if endVal is valid
    let newUpdates: Update[] = [];
    let state = OFFVAL; // could be merged with endVal likely?
    for (let i = 0; i < updates.length; i++) {
      // convert to a while loop later for cleaner code.
      if (ended == true) {
        // after the range
        newUpdates.push(updates[i]);
        continue;
      }
      if (started == true) {
        // in the range
        if (updates[i].idx > end) {
          // console.log("Adding end at ", end, " with val ", endVal, "update ", updates[i], " state ", state, " what ", updates[i-1]);
          if (endValid && val != endVal)
            newUpdates.push(new Update(end, style, endVal));
          newUpdates.push(updates[i]);
          ended = true;
        } else if (updates[i].idx == end && updates[i].style == style) {
          // one is off, other is on, they cancel
          if (
            !(
              (updates[i].val == OFFVAL && endVal != OFFVAL) ||
              (updates[i].val != OFFVAL && endVal == OFFVAL)
            )
          )
            newUpdates.push(updates[i]);
          ended = true;
        } else {
          if (updates[i].style == style)
            endVal = updates[i].val || OFFVAL; // store what val it should swap to when ending.
          // basically, if it overlaps fully endVal is OFFVAL, but if it ends inside another interval (A), endVal will be the val of the A, and then the part outside of the new interval will still exist!
          else {
            newUpdates.push(updates[i]);
          }
        }
      }
      // before the range
      else if (updates[i].style == style && start == updates[i].idx) {
        // eql
        if (state != val && !(val == OFFVAL && state == OFFVAL))
          newUpdates.push(new Update(start, style, val));
        if (updates[i].style == style) {
          endVal = updates[i].val || OFFVAL; // if(val != OFFVAL) is because of inversions (turning off a style)
          endValid = true;
        }
        started = true;
      } else if (start < updates[i].idx) {
        // start between first and last
        started = true;
        if (state != val) {
          // if starting isn't redundant
          newUpdates.push(new Update(start, style, val));
        }
        if (updates[i].idx > end) {
          // ends before this update
          // console.log("endval is ", endVal, " state ", state);
          if (val != endVal) newUpdates.push(new Update(end, style, endVal)); // if ending isn't reundant
          ended = true;
          newUpdates.push(updates[i]);
        } // might be missing logic for if(updates[i].idx == end && updates[i].style == style) here lol
        else {
          if (updates[i].style == style) {
            endVal = updates[i].val || OFFVAL;
            endValid = true;
          } else newUpdates.push(updates[i]);
        }
      } else {
        newUpdates.push(updates[i]);
        if (updates[i].style == style) {
          endVal = updates[i].val || OFFVAL;
          endValid = true;
        }
      }
      if (updates[i].style == style) state = updates[i].val || OFFVAL;
    }
    if (!started) newUpdates.push(new Update(start, style, val));
    if (!ended) newUpdates.push(new Update(end, style, endVal));
    return newUpdates;
  }

  // Check if it's fully overlapping (and thus needs to be an inverse)
  function fullOverlapCheck(
    start: number,
    end: number,
    style: string,
    updates: Update[],
  ) {
    if (!isInvertible.includes(style) || updates.length == 0) return false;
    let started = false,
      fullOverlap = true;
    let state = OFFVAL;
    let i = 0;
    while (i < updates.length) {
      if (updates[i].idx > start) started = true;
      if (started == true && state == OFFVAL) fullOverlap = false;
      if (updates[i].idx > end) return fullOverlap;
      if (updates[i].style == style) state = updates[i].val || OFFVAL;
      i++;
    }
    if (started == false || updates[updates.length - 1].idx < end) return false; // never started, thus can't overlap
    return fullOverlap;
  }

  // Merges updates together, to reduce the number.
  // TODO: Create a "default" styling applied to the whole div, and updates of the "default" are removed/ignored.
  function mergeUpdates(updates: Update[]): Update[] {
    const nums: Record<string, number> = {};
    const vals: Record<string, string> = {};
    for (let i = 0; i < stylingTypes.length; i++) {
      nums[stylingTypes[i]] = 0;
      vals[stylingTypes[i]] = "";
    }

    let newUpdates: Update[] = [];
    for (let i = 0; i < updates.length; i++) {
      let styleKey = updates[i].style as keyof typeof nums;
      if (updates[i].val == OFFVAL) {
        nums[styleKey] -= 1; // popping back
        if (nums[styleKey] == 0) newUpdates.push(updates[i]); // this is when the style is actually removed
        if (nums[styleKey] < 0) nums[styleKey] = 0;
        continue;
      }
      if (nums[styleKey] <= 0) {
        // It is not styled
        newUpdates.push(updates[i]); // the styling must be applied
        nums[styleKey] = 1;
        vals[styleKey] = updates[i].val || OFFVAL;
      } else if (vals[styleKey] == updates[i].val) nums[styleKey]++;
      else if (vals[styleKey] != updates[i].val) {
        nums[styleKey] = 1;
        vals[styleKey] = updates[i].val || OFFVAL;
        newUpdates.push(updates[i]); // change to new val
      }
    }
    return newUpdates;
  }

  function renderStyledDivs(text: string, updates: Update[]) {
    const state: Record<string, string> = {};
    for (let i = 0; i < stylingTypes.length; i++)
      state[stylingTypes[i]] = OFFVAL;

    const toStyleString = () => {
      // inline styling for now
      let styles = "";
      if (state.bold != OFFVAL) styles += "font-weight:" + state.bold + ";";
      if (state.italic != OFFVAL) styles += "font-style:italic;";
      const decorations = [
        state.underline != OFFVAL ? "underline" : "",
        state.strike != OFFVAL ? "line-through" : "",
      ]
        .filter(Boolean)
        .join(" ");
      if (decorations) styles += `text-decoration:${decorations};`;
      if (state.fontFamily != OFFVAL)
        styles += "font-family:" + state.fontFamily + ";";
      if (state.fontSize != OFFVAL)
        styles += "font-size:" + state.fontSize + ";";
      styles += "display:inline-block;"; // not sure if needed, maybe put in an outside css file?
      return styles;
    };

    let html = "";
    let curIdx = 0;
    for (let i = 0; i < updates.length; i++) {
      if (updates[i].idx != curIdx) {
        html +=
          '<div style="' +
          toStyleString() +
          '">' +
          text.substring(curIdx, updates[i].idx) +
          "</div>";
        curIdx = updates[i].idx;
      }
      state[updates[i].style as keyof typeof state] = updates[i].val || OFFVAL; // the OFFVAL or null makes it off
    }
    html +=
      '<div style="' +
      toStyleString() +
      '">' +
      text.substring(curIdx) +
      "</div>";
    return html;
  }

  useEffect(() => {
    // Redundant code, it's useless!
    if (!element) return;
    const stored = element.getAttribute("data-styling-updates");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Update[];
        updatesRef.current = parsed;
      } catch (err) {
        console.warn("Failed to parse stored styling updates", err);
      }
    }
  }, [element]);

  // apply style to specific highlighted chars
  const applyStyleToSelection = (property: string, value: string) => {
    if (element) {
      const stored = element.getAttribute("data-styling-updates");
      if (stored) {
        // On save, save this to the db, and also needs to be loaded from the db or stored somewhere ig... maybe in a file?
        try {
          const parsed = JSON.parse(stored) as Update[];
          updatesRef.current = parsed;
        } catch (err) {
          console.warn("Failed to parse stored styling updates", err);
        }
      }
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (element) {
        element.style.setProperty(property, value);
      }
      return;
    }

    const range = selection.getRangeAt(0);

    const container = element; // The container should be the element being updated
    if (!container) return;

    const preRange = document.createRange();
    preRange.selectNodeContents(container);
    preRange.setEnd(range.startContainer, range.startOffset);

    const start = preRange.toString().length;
    const selectedText = range.toString();
    const end = start + selectedText.length;

    if (start == end) {
      // nothing selected
      console.log("Start == end " + start);
      return;
    }

    try {
      const token = propertyToType[property]; // holds the queue for now, remove and replace with a db query
      if (token) {
        let updates = updatesRef.current;
        console.log(
          "stylingUpdates presweep:",
          start,
          " ",
          token,
          " ",
          end,
          " ",
          value,
          " ",
          updates,
        );
        console.log(
          "fulloverlapcheck",
          fullOverlapCheck(start, end, token, updates),
        );
        if (fullOverlapCheck(start, end, token, updates))
          updates = insertUpdate(start, end, token, OFFVAL, updates);
        else updates = insertUpdate(start, end, token, value, updates);
        console.log(
          "stylingUpdates premerge:",
          start,
          " ",
          token,
          " ",
          end,
          " ",
          updates,
        );
        updates = mergeUpdates(updates);
        // console.log('stylingUpdates:', start, " ", token, " ", end, " ", updates);
        if (element) {
          element.setAttribute("data-styling-updates", JSON.stringify(updates)); // remove, and replace with a db query and an unpacking function if needed
          element.innerHTML = renderStyledDivs(
            element.textContent || "",
            updates,
          );
        }
      }
    } catch (e) {
      console.error("Error applying style to selection:", e);
    }
  };

  function applyFontFamily(fontFamily: string) {
    applyStyleToSelection("font-family", fontFamily);
  }

  function getCurrentFont(): string {
    if (!element) return "Arial";
    const computed = window.getComputedStyle(element);
    return computed.fontFamily.split(",")[0].replace(/['"]/g, "") || "Arial";
  }

  const changeFontWeight = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //get current fontweight, if null, set to default fontWeight (400)

    if (e.key == "Enter") {
      if (fontWeight >= 100 && fontWeight <= 900) {
        if (!element) return;
        else {
          element.style.setProperty("font-weight", fontWeight + "");
        }
      }
    }
  };

  function incrementFontWeight(type: String) {
    const incAmt = type == "dec" ? -100 : 100;
    const newFontWeight = fontWeight + incAmt; //local scope, if out of range of conditional, will not affect fontWeight
    if (newFontWeight >= 100 && newFontWeight <= 900) {
      setFontWeight(newFontWeight);
      applyStyleToSelection("font-weight", newFontWeight.toString());
    }
  }

  function toggleBold() {
    applyStyleToSelection("font-weight", "700");
  }

  function toggleItalic() {
    applyStyleToSelection("font-style", "italic");
  }

  function toggleUnderlined() {
    applyStyleToSelection("text-decoration-line", "underline");
  }

  function toggleStrikethrough() {
    applyStyleToSelection("strike", "strike");
  }

  // using buttons to increment/decrement
  function incrementFont(type: String) {
    const amount = type == "dec" ? -0.1 : 0.1;
    const newFont = Number((fontSize + amount).toFixed(1));
    if (newFont >= 1 && newFont <= 100) {
      setFontSize(newFont);
      applyStyleToSelection("font-size", newFont.toString() + "px");
    }
  }

  // when font size changes (ex. user changes)
  const changeFont = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (fontSize >= 1 && fontSize <= 100) {
        setFontSize(fontSize);
        applyStyleToSelection("font-size", fontSize + "px");
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!element) return;
    const computed = window.getComputedStyle(element);
    const currentAlign = computed.textAlign || "left";
    setAlignmentState(currentAlign);
  }, [element]);

  function setAlignment(alignment: string) {
    if (!element) return;

    const computed = window.getComputedStyle(element);
    const display = computed.display;

    if (
      display === "inline" ||
      display === "inline-flex" ||
      display === "inline-block"
    ) {
      const parent = element.parentElement;

      let wrapper = parent?.hasAttribute("data-alignment-wrapper")
        ? parent
        : null;

      if (!wrapper && parent) {
        wrapper = document.createElement("div");
        wrapper.setAttribute("data-alignment-wrapper", "true");
        wrapper.style.display = "inline-block";
        wrapper.style.width = "100%";

        parent.insertBefore(wrapper, element);
        wrapper.appendChild(element);
      }

      if (wrapper) {
        wrapper.style.textAlign = alignment;
      }
    } else {
      element.style.textAlign = alignment;
    }

    setAlignmentState(alignment);
  }
  return (
    <div
      ref={popupRef}
      id="text-setting-popup-ui-component"
      className="text-setting-popup-ui-component"
      style={{
        position: "absolute",
        top: position?.y ?? 100,
        left: position?.x ?? 100,
      }}
    >
      <div>
        <h2>Text Settings</h2>
        <hr></hr>
      </div>
      <div className="text-setting-popup-ui-component-section">
        <div>
          Style
          <select
            value={getCurrentFont()}
            onChange={(e) => applyFontFamily(e.target.value)}
            className="font-selector"
          >
            {Object.values(FontEnum).map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <hr></hr>
        <div>Font</div>
        <hr></hr>
        <div style={{ display: "flex" }}>
          <button onClick={() => incrementFont("dec")}>-</button>
          <input
            type="number"
            value={fontSize}
            min="1"
            max="100"
            step="0.1"
            onChange={(e) => setFontSize(Number(e.target.value))}
            onKeyDown={(e) => changeFont(e)}
            style={{ display: "flex", textAlign: "center" }}
          />
          <button onClick={() => incrementFont("inc")}>+</button>
        </div>
        <hr></hr>
        <div>
          <ul>
            <li>
              <button onClick={toggleBold}>B</button>

              <div>
                <button onClick={() => incrementFontWeight("dec")}>-</button>
                <input
                  type="number"
                  value={fontWeight}
                  min="100"
                  max="900"
                  step="100"
                  style={{ width: "40px", textAlign: "center" }}
                  onChange={(e) => setFontWeight(Number(e.target.value))}
                  onKeyDown={(e) => changeFontWeight(e)}
                />
                <button onClick={() => incrementFontWeight("inc")}>+</button>
              </div>
            </li>
            <li>
              <button onClick={toggleItalic}>I</button>
            </li>
            <li>
              <button onClick={toggleUnderlined}>U</button>
            </li>
            <li>
              <button onClick={toggleStrikethrough}>S</button>
            </li>
          </ul>
        </div>
        <hr></hr>
        <div>
          Alignment
          <select
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <SaveButton selectedElement={element} />
      </div>
    </div>
  );
}

export default TextSettingPopupUIComponent;
