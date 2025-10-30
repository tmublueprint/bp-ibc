import './App.css'
import EditableTextBox from './components/editable/EditableTextBox'
import UIContextProvider from './context/UIContext'

function App() {

  return (
    <UIContextProvider>
      <span data-editable="true">Click me! then double-click me!</span>
      <br></br>
      <EditableTextBox initialText={"hello world"}/>
      <br />
      <EditableTextBox initialText={"goodbye"} />
    </UIContextProvider>
  )
}

export default App
