import React from 'react'
import { Point } from '../model'
import { repr } from '../util/point'

export const Connect = React.memo(function (props: { a: Point; b: Point }) {
  const { a, b } = props
  const c1 = [b[0], a[1]] as const
  const c2 = [a[0], b[1]] as const
  return <path d={`M${repr(a)} C${repr(c1)} ${repr(c2)} ${repr(b)}`} fill="transparent"></path>
})
