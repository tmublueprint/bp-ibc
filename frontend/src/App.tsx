import './App.css'
import EditableTextBox from './components/editable/EditableTextBox'
import UIContextProvider from './context/UIContext'

function App() {

  return (
    <UIContextProvider>
      <span data-editable='true'>Click me! then double-click me!</span>
      <br></br>
      <EditableTextBox initialText={"hello world"}/>
      <br />
      <EditableTextBox initialText={"goodbye"} />
      <p data-editable='true'>hello</p>
    </UIContextProvider>
  )
}

export default App
