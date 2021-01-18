export type NodeDirection = 'left' | 'right'

export interface Child {
  id: string
  label: string
  children: Node[]
  expanded: boolean
  direction: NodeDirection
  outline?: boolean
}

export type Root = Omit<Child, 'id' | 'expanded' | 'direction'> & {
  id: 'root',
  expanded: true,  // dummy properties
  direction: 'right'
}

export type Node = Root | Child

export type Vector = readonly [x: number, y: number]

export type Point = Vector

export type ViewNode<T extends Node = Child> = Omit<T, 'children'> & {
  children: ViewNode<Child>[]
  coord: Point
  size: Vector
}

export type ViewRoot = Omit<ViewNode<Root>, 'coord'> & { coord: [0, 0] }
