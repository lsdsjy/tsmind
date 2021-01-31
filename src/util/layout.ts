import { sumBy } from 'lodash-es'
import { CSSProperties } from 'react'
import { config } from '../config'
import { Canvas, CanvasView, NodeDirection, Point, Rect, TreeNode, TreeNodeView, Vector } from '../model'

function surrounds(rs: Rect[]) {
  function surround(a: Rect, b: Rect): Rect {
    return {
      top: Math.min(a.top, b.top),
      left: Math.min(a.left, b.left),
      bottom: Math.max(a.bottom, b.bottom),
      right: Math.max(a.right, b.right),
    }
  }
  return rs.reduce((acc, rect) => surround(acc, rect), {
    top: Infinity,
    left: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  })
}

export function getNodeStyle(node: TreeNode): CSSProperties {
  return {
    position: 'absolute',
    padding: `${config.textVerticalPadding}px ${config.textHorizontalPadding}px`,
    border: '1px solid black',
    boxSizing: 'border-box',
    borderRadius: '5px',
    backgroundColor: 'white',
    ...(node.fixedWidth
      ? {
          maxWidth: `${node.fixedWidth}px`,
          width: `${node.fixedWidth}px`,
          overflowWrap: 'break-word',
          whiteSpace: 'break-spaces',
        }
      : {
          whiteSpace: 'nowrap',
        }),
  }
}

type NodeWithHeight = Omit<TreeNode, 'children' | 'coord'> & {
  /**
   * subtree height
   */
  height: number
  children: NodeWithHeight[]
  coord: Point
  size: Vector
}

type UnresolvedViewNode = Omit<TreeNode, 'children' | 'coord'> & {
  children: UnresolvedViewNode[]
  size: () => Vector
  coord: Point
}

const memo = new WeakMap<TreeNode, NodeWithHeight>()

function withSize(root: TreeNode): NodeWithHeight {
  if (memo.has(root)) {
    return memo.get(root)!
  }

  const frag = new DocumentFragment()

  function getMeasurer(node: TreeNode) {
    const span = document.createElement('span')
    span.setAttribute('style', `visibility: hidden;`)
    Object.assign(span.style, getNodeStyle(node))
    span.innerText = node.label
    frag.appendChild(span)
    return span
  }

  function helper(node: TreeNode): UnresolvedViewNode {
    /**
     * collapsed children don't need actual size
     */
    function dummy(node: TreeNode): UnresolvedViewNode {
      return {
        coord: [0, 0],
        ...node,
        children: node.children.map(dummy),
        size: () => [0, 0],
      }
    }
    const children = node.children.map(node.expanded ? helper : dummy)

    const measurer = getMeasurer(node)

    return {
      coord: [0, 0], // dummy coord, would be overwritten by root coord
      ...node,
      children,
      size: () => {
        const { width, height } = measurer.getBoundingClientRect()
        const size = [width, height] as const
        measurer.remove()
        return size
      },
    }
  }

  function resolve(node: UnresolvedViewNode): NodeWithHeight {
    function dummy(node: UnresolvedViewNode): NodeWithHeight {
      return {
        ...node,
        size: node.size(),
        height: 0,
        children: node.children.map(dummy),
      }
    }
    const children = node.children.map(node.expanded ? resolve : dummy)
    const size = node.size()

    // total height of this subtree
    const height = Math.max(size[1], config.verticalSpan * (children.length - 1) + sumBy(children, 'height'))

    return {
      ...node,
      size,
      height,
      children,
    }
  }

  const newRoot = helper(root)
  document.body.appendChild(frag)
  const resolved = resolve(newRoot)
  memo.set(root, resolved)
  return resolved
}

function layOut(root: TreeNode, direction: NodeDirection): TreeNodeView {
  function dummy(node: NodeWithHeight): TreeNodeView {
    return {
      ...node,
      children: node.children.map(dummy),
      summaries: [],
    }
  }

  function layOutInternal(root: NodeWithHeight): { node: TreeNodeView; rect: Rect } {
    // records total height of nodes above current node
    let accHeight = 0

    let rect = {
      top: root.coord[1] - root.size[1] / 2 - config.summaryPadding,
      bottom: root.coord[1] + root.size[1] / 2 + config.summaryPadding,
      left: root.coord[0] - root.size[0] / 2 - config.summaryPadding,
      right: root.coord[0] + root.size[0] / 2 + config.summaryPadding,
    }

    if (!root.expanded) {
      return { node: { ...root, children: root.children.map(dummy), summaries: [] }, rect }
    }

    for (const node of root.children) {
      node.coord = [
        root.coord[0] + (root.size[0] / 2 + config.horizontalSpan + node.size[0] / 2) * (direction === 'left' ? -1 : 1),
        root.coord[1] + accHeight - root.height / 2 + node.height / 2,
      ]
      accHeight += node.height + config.verticalSpan
    }

    let children = root.children.map(layOutInternal)
    let childrenNodes = children.map((child, i) => ({
      ...child.node,
      summaries: root.children[i].summaries.map((summary, i) => ({
        ...summary,
        rect: surrounds(children.slice(i, i + summary.count).map((child) => child.rect)),
      })),
    }))
    rect = surrounds([rect].concat(children.map((child) => child.rect)))

    return {
      node: {
        ...root,
        children: childrenNodes,
        summaries: root.summaries.map((summary) => ({ ...summary, rect })),
      },
      rect,
    }
  }

  return layOutInternal(withSize(root)).node
}

export function layOutRoot(root: TreeNode): TreeNodeView {
  const onlyDirection = (direction: NodeDirection) =>
    layOut({ ...root, children: root.children.filter((node) => node.direction === direction) }, direction)
  const right = onlyDirection('right')
  return {
    ...right,
    children: right.children.concat(onlyDirection('left').children),
  }
}

export function layOutCanvas(canvas: Canvas): CanvasView {
  return {
    children: canvas.children.map(layOutRoot),
  }
}
