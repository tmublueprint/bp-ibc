import './App.css'
import TextSettingPopupUIComponent from './components/textsetting/TextSettingPopupUIComponent'
import EditableTextBox from './components/editable/EditableTextBox'

function App() {

  return (
    <>
      <TextSettingPopupUIComponent />
      <EditableTextBox initialText={"hello world"}/>
      <br />
      <EditableTextBox initialText={"goodbye"} />
    </>
  )
}

export default App
