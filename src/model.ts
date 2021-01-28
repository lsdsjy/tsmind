export type NodeDirection = 'left' | 'right'

export type NodeId = string

export interface TreeNode {
  root?: boolean
  id: NodeId
  label: string
  children: TreeNode[]
  expanded: boolean
  direction: NodeDirection
  dropPreview?: boolean
  outline?: boolean
}

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type TreeNodeView = Omit<TreeNode, 'children'> & {
  children: TreeNodeView[]
  coord: Point
  size: Vector
}

export interface Canvas {
  roots: TreeNode[]
}

/**
 * path from canvas to some node
 */
export type NodePath = (string | number)[]
