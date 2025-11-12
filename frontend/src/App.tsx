import './App.css'
import UIContextProvider from './context/UIContext'

function App() {

  return (
    <UIContextProvider>
      <span data-editable='true'>Click me! then double-click me!</span>
      <br></br>
      <p data-editable='true'>hello</p>
    </UIContextProvider>
  )
}

export default App
