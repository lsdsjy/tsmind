import { NodeDirection, TreeNode, TreeNodeView } from '../model'

export function isRoot(node: TreeNode | TreeNodeView) {
  return !!node.root
}

export function newId() {
  return Math.random().toString(36).slice(2)
}

export function newNode(direction: NodeDirection, root = false, label = ''): TreeNode {
  return {
    root,
    id: newId(),
    label,
    direction,
    expanded: true,
    children: []
  }
}
