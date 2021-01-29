import { append, lensPath, over } from 'ramda'
import React, { useCallback, useContext, useRef } from 'react'
import { CanvasContext } from '../canvas-context'
import { CanvasView } from '../model'
import { newNode } from '../util/node'
import { Node } from './Node'

const scale = 1
const width = 600
const height = 600

export function MindMap(props: { canvas: CanvasView }) {
  const { canvas } = props
  const { setCanvas } = useContext(CanvasContext)
  const ref = useRef<HTMLDivElement>(null!)
  const getCoord = useCallback((clientX: number, clientY: number) => {
    const { left, top } = ref.current.getBoundingClientRect()
    return [clientX - left - (width / 2) * scale, clientY - top - (height / 2) * scale] as const
  }, [])

  return (
    <div
      ref={ref}
      style={{ width, height }}
      onMouseDown={(e) => {
        if (e.detail > 1) {
          e.preventDefault()
        }
      }}
      onDoubleClick={(e) => {
        e.preventDefault()
        setCanvas(
          over(
            lensPath(['children']),
            append(newNode({ root: true, label: 'Free Node', coord: getCoord(e.clientX, e.clientY) }))
          )
        )
      }}
    >
      <div style={{ transform: `translate(${width / 2}px, ${height / 2}px)` }}>
        {canvas.children.map((root, i) => (
          <Node key={root.id} node={root} path={[i]} getCoord={getCoord} />
        ))}
        {canvas.dragSource && !canvas.dropTarget && (
          <Node node={canvas.dragSource} path={[]} getCoord={getCoord}></Node>
        )}
      </div>
    </div>
  )
}
