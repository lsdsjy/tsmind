import { createContext } from 'react'
import { TreeNode } from './model'

export const RootContext = createContext({
  root: null! as TreeNode,
  setRoot: (_: TreeNode) => {}
})