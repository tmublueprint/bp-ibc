import { getAuth } from "firebase/auth";

type SaveButtonProps = {
  selectedElement: HTMLElement | null | undefined;
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
    const section_num = all.indexOf(selectedElement) + 1; // 1-based
    if (section_num <= 0) {
      console.log("Selected element is not in editable leaf list");
      return;
    }

    const sectionData = {
      page_id,
      section_num,
      styling: selectedElement.getAttribute("data-styling-updates") ?? "",
      content: {
        text: selectedElement.textContent ?? "",
        html: selectedElement.innerHTML ?? "",
      },
    };

    console.log("Posting section:", sectionData);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log("Not logged in");
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:3001/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(sectionData),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`POST failed: ${res.status} ${errText}`);
      }

      const created = await res.json();
      console.log("Created section response:", created);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return <button onClick={saveCurrentSection}>Save</button>;
}

export default SaveButton;
