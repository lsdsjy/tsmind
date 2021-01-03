import React, { useMemo } from 'react'
import { Root } from '../model'
import { layOutRoot } from '../util/layout'
import { Node } from './Node'

export function MindMap(props: { root: Root }) {
  const { root } = props
  const viewRoot = useMemo(() => layOutRoot(root), [root])
  return (
    <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
      <Node node={viewRoot} />
    </svg>
  )
}
