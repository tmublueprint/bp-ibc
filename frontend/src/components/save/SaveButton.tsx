function SaveButton(){
  const savePage = async () => {
    console.log("Save button clicked.");

    const pageElements = Array.from(document.body.querySelectorAll(
      '[data-editable][data-editable-leaf="true"]'
    ));

    const pageName = window.location.pathname.split("/").pop() ?? "";
    const payload = pageElements.map((element, index) => ({
      Content: element.textContent ?? "",
      Styling: "",  //TO DO: ADD STYLE GETTING FUNCTION
      Section_number: index + 1,
      Page: pageName
    }));

    try {
      const response = await fetch('https://localhost:3001/api/sections', {
        method: "POST", 
        headers: { 'Content-type': 'application/json' }, 
        body: JSON.stringify(payload),  
      });

      if (!response.ok)throw new Error("error: failed to create");

      const result = await response.json();
      console.log("created: ", result);
      
    } catch (error) {
      console.error("error: ", error);
    }
    
    console.log("All sections saved.");
    console.log(pageElements)
  }

  return <button onClick={savePage}>Save</button>;
}

export default SaveButton;