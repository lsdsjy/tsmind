import React from 'react'
import { ViewNode, ViewRoot } from '../model'
import { Connect } from './Connect'

export const Node = React.memo(function (props: { node: ViewNode | ViewRoot }) {
  const { node } = props
  const [x, y] = [node.coord[0] - node.size[0] / 2, node.coord[1] - node.size[1] / 2]
  return <>
    {node.children.map(child => <div key={child.id}>
      <Connect a={node.coord} b={child.coord} />
      <Node node={child} />
    </div>)}
    <div className="node" style={{ width: node.size[0], height: node.size[1], top: y, left: x, border: '1px solid black', borderRadius: '5px', lineHeight: `${node.size[1]}px`, backgroundColor: 'white' }}>{node.label}</div>
  </>
})
