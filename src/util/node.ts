import { Point, TreeNode, TreeNodeView } from '../model'

export function isRoot(node: TreeNode | TreeNodeView) {
  return !!node.root
}

export function newId() {
  return Math.random().toString(36).slice(2)
}

type NewNodeOptions = Partial<Pick<TreeNode, 'direction' | 'label'>> & ({ root?: false } | { root: true; coord: Point })

export function newNode(opt: NewNodeOptions = {}): TreeNode {
  // can't use parameter destructuring with TS discriminiated union
  const { label = 'New Node', direction = 'right' } = opt

  return {
    root: opt.root,
    id: newId(),
    label,
    direction,
    expanded: true,
    children: [],
    ...(opt.root ? { coord: opt.coord } : {}),
  }
}
