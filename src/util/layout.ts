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

export function getNodeStyle(node: Node) {
  return {
    padding: `${config.textVerticalPadding}px ${config.textHorizontalPadding}px`,
  }
}

export function getNodeStyleString(node: Node) {
  return Object.entries(getNodeStyle(node)).map(([key, value]) => `${key}: ${value}`).join(';')
}

type ViewNodeWithHeight = Omit<ViewNode, 'children'> & { children: ViewNodeWithHeight[]; height: number }
type UnresolvedViewNode = Omit<ViewNode, 'children' | 'size'> & { children: UnresolvedViewNode[]; size: () => Vector; }

function withSize(root: Node): ViewNodeWithHeight {

  const frag = new DocumentFragment()

  function getMeasurer(node: Node) {
    const span = document.createElement('span')
    span.setAttribute('style', `position: absolute; visibility: hidden; user-select: none; ${getNodeStyleString(node)}`)
    span.innerText = node.label
    frag.appendChild(span)
    return span
  }

  function helper(node: Node): UnresolvedViewNode {
    const children = node.children.map(helper)

    const measurer = getMeasurer(node)

    return {
      ...node,
      children,
      coord: [0, 0],  // dummy coord
      size: () => {
        const size = [measurer.clientWidth, measurer.clientHeight] as const
        measurer.remove()
        return size
      },
    }
  }

  function resolve(node: UnresolvedViewNode): ViewNodeWithHeight {
    const children = node.children.map(resolve)
    const size = node.size()

    // total height of this subtree
    const height = Math.max(size[1], config.verticalSpan * (children.length - 1) + sumBy(children, 'height'))

    return {
      ...node,
      size,
      height, 
      children
    }
  }

  const newRoot = helper(root)
  document.body.appendChild(frag)
  return resolve(newRoot)
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
