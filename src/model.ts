export type NodeDirection = 'left' | 'right'

export type NodeId = string

/**
 * path from root to some descendant
 */
export type NodePath = (string | number)[]

export interface TreeNode {
  root?: boolean
  id: NodeId
  label: string
  children: TreeNode[]
  expanded: boolean
  direction: NodeDirection
  outline?: boolean
}

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type TreeNodeView = Omit<TreeNode, 'children'> & {
  children: TreeNodeView[]
  coord: Point
  size: Vector
}
