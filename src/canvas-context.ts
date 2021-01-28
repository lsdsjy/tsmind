import { createContext } from 'react'
import { Canvas } from './model'

export const CanvasContext = createContext({
  canvas: null! as Canvas,
  setCanvas: (_: Canvas) => {},
})
