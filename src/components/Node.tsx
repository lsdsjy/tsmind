import React from 'react'
import { config } from '../config'
import { ViewNode, ViewRoot } from '../model'
import { Connect } from './Connect'

export const Node = React.memo(function (props: { node: ViewNode | ViewRoot }) {
  const { node } = props
  return <>
    {node.children.map(child => <>
      <Connect a={node.coord} b={child.coord} />
      <Node node={child} />
    </>)}
    <rect width={node.size[0]} height={node.size[1]} x={node.coord[0] - node.size[0] / 2} y={node.coord[1] - node.size[1] / 2} rx="5" stroke={config.stroke} fill={config.fill} />
  </>
})
