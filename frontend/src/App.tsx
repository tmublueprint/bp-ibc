import './App.css'
import TextSettingPopupUIComponent from './components/textsetting/TextSettingPopupUIComponent'
import EditableTextBox from './components/editable/EditableTextBox'

function App() {

  return (
    <>
      <TextSettingPopupUIComponent />
      <EditableTextBox value={"hello world"}/>
    </>
  )
}

export default App
