import React from "react";

type SaveButtonProps = {
  selectedElement: HTMLElement | null | undefined;
};

type StylingEvent = {
  idx: number;
  style: string;
  val?: string | null;
};

function SaveButton({ selectedElement }: SaveButtonProps) {
  const saveCurrentSection = async () => {
    console.log("Save clicked");

    if (!selectedElement) {
      console.log("No selected element to save");
      return;
    }

    const page_id = window.location.pathname.split("/").pop() ?? "";

    const all = Array.from(
      document.body.querySelectorAll<HTMLElement>(
        '[data-editable][data-editable-leaf="true"]',
      ),
    );

    const section_number = all.indexOf(selectedElement) + 1;

    if (section_number <= 0) {
      console.log("Selected element is not in editable leaf list");
      return;
    }

    const stylingUpdatesRaw =
      selectedElement.getAttribute("data-styling-updates") ?? "[]";

    let styling_events: StylingEvent[] = [];
    try {
      styling_events = JSON.parse(stylingUpdatesRaw) as StylingEvent[];
    } catch (err) {
      console.warn("Failed to parse styling updates:", err);
    }

    const sectionPayload = {
      page_id,
      section_number,
    };

    const contentPayloadBase = {
      content: {
        text: selectedElement.textContent ?? "",
        styling_events,
      },
    };

    console.log("Posting section:", sectionPayload);
    console.log("Posting content base:", contentPayloadBase);

    try {
      const sectionRes = await fetch("http://localhost:3001/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionPayload),
      });

      if (!sectionRes.ok) {
        const errText = await sectionRes.text().catch(() => "");
        throw new Error(`Section POST failed: ${sectionRes.status} ${errText}`);
      }

      const createdSection = await sectionRes.json();
      console.log("Created section response:", createdSection);

      if (!createdSection?.id) {
        throw new Error("Section response missing id");
      }

      const contentPayload = {
        section_id: createdSection.id,
        ...contentPayloadBase,
      };

      console.log("Posting content:", contentPayload);

      const contentRes = await fetch("http://localhost:3001/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentPayload),
      });

      if (!contentRes.ok) {
        const errText = await contentRes.text().catch(() => "");
        throw new Error(`Content POST failed: ${contentRes.status} ${errText}`);
      }

      const createdContent = await contentRes.json();
      console.log("Created content response:", createdContent);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return <button onClick={saveCurrentSection}>Save</button>;
}

export default SaveButton;
