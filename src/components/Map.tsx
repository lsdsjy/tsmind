import React, { useMemo } from 'react'
import { Root } from '../model'
import { layOutRoot } from '../util/layout'
import { Node } from './Node'

export function MindMap(props: { root: Root }) {
  const { root } = props
  const viewRoot = useMemo(() => layOutRoot(root), [root])
  return (
    <div style={{ transform: 'translate(300px, 300px)' }}>
      <Node node={viewRoot} />
    </div>
  )
}
