import { sumBy } from 'lodash-es'
import { config } from '../config'
import { Node, NodeDirection, Root, Vector, ViewNode, ViewRoot } from '../model'
import { measureText } from './measure'
import { add, sub, translate } from './point'

export function move(root: ViewNode, offset: Vector): ViewNode {
  return {
    ...root,
    coord: translate(root.coord, offset),
    children: root.children.map((node) => move(node, offset)),
  }
}

export function moveTo(root: ViewNode, target: Vector): ViewNode {
  const offset = sub(target, root.coord)
  return move(root, offset)
}

type ViewNodeWithHeight = Omit<ViewNode, 'children'> & { children: ViewNodeWithHeight[]; height: number }

function withSize(root: Node): ViewNodeWithHeight {
  const size = add(measureText(root.label), [20, 10])
  const children = root.children.map(withSize)

  // total height of this subtree
  const height = Math.max(size[1], config.verticalSpan * (children.length - 1) + sumBy(children, 'height'))

  return {
    ...root,
    children,
    coord: [0, 0],  // dummy coord
    size,
    height
  }
}

function layOut(root: Node | Root, direction: NodeDirection): ViewNode {
  function layOutInternal(root: ViewNodeWithHeight): ViewNode {
    
    // records total height of nodes above current node
    let accHeight = 0
    for (const node of root.children) {
      node.coord = [
        root.coord[0] + ((root.size[0] / 2 + config.horizontalSpan + node.size[0] / 2) * (direction === 'left' ? -1 : 1)),
        root.coord[1] + accHeight - root.height / 2 + node.height / 2
      ]
      accHeight += node.height + config.verticalSpan
    }

    return {
      ...root,
      children: root.children.map(layOutInternal)
    }
  }

  return layOutInternal(withSize(root))
}

export function layOutRoot(root: Root): ViewRoot {
  const onlyDirection = (direction: NodeDirection) => layOut({ ...root, children: root.children.filter(node => node.direction === direction) }, direction) as ViewRoot
  const right = onlyDirection('right')
  return {
    ...right,
    children: right.children.concat(onlyDirection('left').children)
  }
}
