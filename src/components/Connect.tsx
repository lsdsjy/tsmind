import React from 'react'
import { config } from '../config'
import { Point, TreeNodeView } from '../model'
import { add, repr, sub } from '../util/point'

const Shape = React.memo(function (props: { a: Point; b: Point }) {
  const { a, b } = props
  const top = Math.min(a[1], b[1])
  const left = Math.min(a[0], b[0])
  const width = Math.max(Math.abs(a[0] - b[0]), 1)
  const height = Math.max(Math.abs(a[1] - b[1]), 1)
  const topLeft = [left, top] as const
  const c1 = [b[0] - left, a[1] - top] as const
  const c2 = [a[0] - left, b[1] - top] as const
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', zIndex: -1, top, left, width, height }}
    >
      <path
        d={`M${repr(sub(a, topLeft))} C${repr(c1)} ${repr(c2)} ${repr(sub(b, topLeft))}`}
        fill="transparent"
        stroke="black"
      ></path>
    </svg>
  )
})

export const Connect = React.memo(function (props: { parent: TreeNodeView; child: TreeNodeView }) {
  const { parent, child } = props
  return (
    <Shape
      a={parent.coord}
      b={add(child.coord, [
        (config.connectOffset - child.size[0] / 2) * (child.direction === 'left' ? -1 : 1),
        0,
      ])}
    />
  )
})
