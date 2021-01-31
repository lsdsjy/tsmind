import { sumBy } from 'lodash-es'
import { CSSProperties } from 'react'
import { config } from '../config'
import { Canvas, CanvasView, NodeDirection, TreeNode, TreeNodeView, Vector } from '../model'

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

type ViewNodeWithHeight = Omit<TreeNodeView, 'children'> & { children: ViewNodeWithHeight[]; height: number }
type UnresolvedViewNode = Omit<TreeNodeView, 'children' | 'size'> & {
  children: UnresolvedViewNode[]
  size: () => Vector
}

const memo = new WeakMap<TreeNode, ViewNodeWithHeight>()

function withSize(root: TreeNode): ViewNodeWithHeight {
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

  function resolve(node: UnresolvedViewNode): ViewNodeWithHeight {
    function dummy(node: UnresolvedViewNode): ViewNodeWithHeight {
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
  function layOutInternal(root: ViewNodeWithHeight): TreeNodeView {
    // records total height of nodes above current node
    let accHeight = 0

    if (!root.expanded) {
      return root
    }

    for (const node of root.children) {
      node.coord = [
        root.coord[0] + (root.size[0] / 2 + config.horizontalSpan + node.size[0] / 2) * (direction === 'left' ? -1 : 1),
        root.coord[1] + accHeight - root.height / 2 + node.height / 2,
      ]
      accHeight += node.height + config.verticalSpan
    }

    return {
      ...root,
      children: root.children.map(layOutInternal),
    }
  }

  return layOutInternal(withSize(root))
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
