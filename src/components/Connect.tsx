import React, { useState } from 'react'
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
    <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', zIndex: -1, top, left, width, height }}>
      <path
        d={`M${repr(sub(a, topLeft))} C${repr(c1)} ${repr(c2)} ${repr(sub(b, topLeft))}`}
        fill="transparent"
        stroke="black"
      ></path>
    </svg>
  )
})

/**
 * always display vertex when collapsed (with count prop)
 * display on mouse over when expanded
 */
export const Vertex = function (
  props: { coord: Point; toggle: () => void } & ({ count: number; expanded: false } | { expanded: true })
) {
  const [over, setOver] = useState(false)
  const size = 12

  return (
    <span
      style={{
        opacity: Number(!props.expanded || over),
        position: 'absolute',
        left: props.coord[0],
        top: props.coord[1],
        fontSize: '0.8rem',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px black',
        borderRadius: '1000px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: over ? 'gray' : 'white',
        lineHeight: `${size}px`,
        textAlign: 'center',
        userSelect: 'none',
        cursor: 'pointer',
        transition: over ? 'opacity .3s ease' : '',
      }}
      onClick={props.toggle}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
    >
      {props.expanded ? '-' : props.count}
    </span>
  )
}

export const Connect = React.memo(function (props: { parent: TreeNodeView; toggle: () => void }) {
  const { parent } = props
  const { children } = parent

  const vertex: Point =
    parent.root || !parent.children.length ? parent.coord : [parent.coord[0] + parent.size[0] / 2 + 10, parent.coord[1]]

  return (
    <>
      {parent.root || (
        <>
          <Shape a={parent.coord} b={vertex} />
          <Vertex coord={vertex} expanded={parent.expanded} count={parent.children.length} toggle={props.toggle} />
        </>
      )}
      {parent.expanded &&
        children.map((child, i) => (
          <Shape
            key={i}
            a={vertex}
            b={add(child.coord, [
              (config.connectOffset - child.size[0] / 2) * (child.direction === 'left' ? -1 : 1),
              0,
            ])}
          />
        ))}
    </>
  )
})
