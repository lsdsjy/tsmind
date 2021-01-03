import React, { useState } from 'react'
import './App.css'
import { MindMap } from './components/Map'
import root from './mock'

function App() {
  return (
    <div className="App">
      <MindMap root={root} />
    </div>
  )
}

export default App
