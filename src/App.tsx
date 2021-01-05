import React, { useState } from 'react'
import './App.css'
import { MindMap } from './components/Map'
import mockRoot from './mock'
import { ViewRoot } from './model'

function App() {
  const [root, setRoot] = useState(mockRoot as ViewRoot)
  return (
    <div className="App">
      <MindMap root={root} onChange={setRoot as any} />
    </div>
  )
}

export default App
