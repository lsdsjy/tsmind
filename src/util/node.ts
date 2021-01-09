import { Node, NodeDirection, Root } from '../model'

export function isRoot(node: Node): node is Root {
  return node.id === 'root'
}

export function newId() {
  return Math.random().toString(36).slice(2)
}

export function newNode(direction: NodeDirection, label = ''): Node {
  return {
    id: newId(),
    label,
    direction,
    expanded: true,
    children: []
  }
}
