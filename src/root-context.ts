import { createContext } from 'react'
import { Root } from './model'

export const RootContext = createContext({
  root: null! as Root,
  setRoot: (root: Root) => {}
})