import { createContext } from 'react'
import { NodePath, Point, Vector } from './model'

export const DndContext = createContext<{
    startDragging: (path: NodePath, getCoord: (x: number, y: number) => Vector, start: Point) => void
}>({
    startDragging: () => {}
})
