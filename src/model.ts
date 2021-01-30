export type NodeDirection = 'left' | 'right'

export type NodeId = string

export interface TreeNode {
  root?: boolean
  coord?: Point
  id: NodeId
  label: string
  children: TreeNode[]
  expanded: boolean
  direction: NodeDirection
  fixedWidth?: number
  dropPreview?: boolean
}

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type TreeNodeView = Omit<TreeNode, 'children'> & {
  children: TreeNodeView[]
  coord: Point
  size: Vector
}

export interface Canvas {
  /**
   * children of canvas are isolated trees
   */
  children: TreeNode[]
}

export type CanvasView = Omit<Canvas, 'children'> & {
  children: TreeNodeView[]
  dragSource?: TreeNodeView
  dropTarget?: NodePath
}

/**
 * path from canvas to some node
 */
export type NodePath = number[]
