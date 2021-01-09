import React, { useMemo } from 'react'
import { Root, ViewNode } from '../model'
import { layOutRoot } from '../util/layout'
import { Node } from './Node'

export function MindMap(props: { root: Root; onChange: (root: ViewNode) => void }) {
  const { root } = props
  const viewRoot = useMemo(() => layOutRoot(root), [root])
  return (
    <div style={{ transform: 'translate(300px, 300px)' }}>
      <Node onCreateSibling={() => {}} node={viewRoot} onChange={(newRoot) => props.onChange(newRoot)} />
    </div>
  )
}
