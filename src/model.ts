export type NodeDirection = 'left' | 'right'

export type NodeId = string

export interface Summary {
  /**
   * number of continuous top-level nodes in this summary
   */
  count: number
  label: string
  fixedWidth?: number
}

export type Boundary = Omit<Summary, 'fixedWidth'>

export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
}

export type SummaryView = Summary & { rect: Rect }

export type BoundaryView = Boundary & { rect: Rect }

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
  summaries: Summary[]
}

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type TreeNodeView = Omit<TreeNode, 'children' | 'summaries' | 'coord'> & {
  children: TreeNodeView[]
  summaries: SummaryView[]
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
