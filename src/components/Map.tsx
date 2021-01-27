import React, { useMemo } from 'react'
import { TreeNode } from '../model'
import { layOutRoot } from '../util/layout'
import { Node } from './Node'

export function MindMap(props: { root: TreeNode; onChange: (root: TreeNode) => void }) {
  const { root } = props
  const rootView = useMemo(() => layOutRoot(root), [root])
  return (
    <div style={{ transform: 'translate(300px, 300px)' }}>
      <Node node={rootView} path={[]} />
    </div>
  )
}
