import React, { useState } from 'react'
import './App.css'
import { MindMap } from './components/Map'
import mockRoot from './mock'
import { Root } from './model'

let undoStack: Root[] = []
let redoStack: Root[] = []

function App() {
  const [root, setRoot] = useState(mockRoot as Root)

  function update(newRoot: Root) {
    undoStack.push(root)
    redoStack = []
    setRoot(newRoot)
  }

  function undo() {
    const last = undoStack.pop()
    if (last) {
      redoStack.push(root)
      setRoot(last)
    }
  }

  function redo() {
    const next = redoStack.pop()
    if (next) {
      undoStack.push(root)
      setRoot(next)
    }
  }

  return (
    <div className="App">
      <button onClick={undo}>undo</button>
      <button onClick={redo}>redo</button>
      <MindMap root={root} onChange={update} />
    </div>
  )
}

export default App
