import { createContext, SetStateAction } from 'react'
import { Canvas } from './model'

export const CanvasContext = createContext({
  canvas: null! as Canvas,
  setCanvas: (_: SetStateAction<Canvas>) => {},
})
