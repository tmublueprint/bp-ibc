import './App.css'
import EditableTextBox from './components/editable/EditableTextBox'
import UIContextProvider from './context/UIContext'

function App() {

  return (
    <UIContextProvider>
      <div>
        <h1 data-editable="true">Click me!</h1>
      </div>
      <EditableTextBox initialText={"hello world"}/>
      <br />
      <EditableTextBox initialText={"goodbye"} />
    </UIContextProvider>
  )
}

export default App
