import { createContext } from 'react'
import { NodePath, Vector } from './model'

export const DndContext = createContext<{
    startDragging: (path: NodePath, getCoord: (x: number, y: number) => Vector) => void
}>({
    startDragging: () => {}
})
