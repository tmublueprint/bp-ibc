import './App.css'
import TextSettingPopupUIComponent from './components/textsetting/TextSettingPopupUIComponent'
import EditableTextBox from './components/editable/EditableTextBox'

function App() {

  return (
    <>
      <TextSettingPopupUIComponent />
      <EditableTextBox value={"hello world"}/>
      <br />
      <EditableTextBox value={"goodbye"} />
    </>
  )
}

export default App
