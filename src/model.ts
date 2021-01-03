export type NodeDirection = 'left' | 'right'

export interface Node {
  id: string
  label: string
  children: Node[]
  expanded: boolean
  direction: NodeDirection
}

export type Root = Omit<Node, 'id' | 'expanded' | 'direction'> & {
  id: 'root',
  expanded: true,  // dummy properties
  direction: 'right'
}

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type ViewNode<T extends Node | Root = Node> = Omit<T, 'children'> & {
  children: ViewNode<Node>[]
  coord: Point
  size: Vector
}

export type ViewRoot = Omit<ViewNode<Root>, 'coord'> & { coord: [0, 0] }
