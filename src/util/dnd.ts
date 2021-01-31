import { config } from '../config'
import { CanvasView, NodePath, Point, TreeNodeView } from '../model'
import { edist } from './point'

/**
 * mesaures the potential of node at coord to be parent's child
 */
function evaluate(parent: TreeNodeView, coord: Point): number {
  return -edist(coord, parent.coord)
}

export function getDropTarget(rootView: CanvasView, coord: Point): NodePath | undefined {
  let candidate = {
    value: -Infinity,
    path: undefined as NodePath | undefined,
  }

  function traverse(node: TreeNodeView, path: NodePath) {
    const value = evaluate(node, coord)
    if (value > candidate.value && coord[0] - node.coord[0] > config.horizontalSpan && coord[0] - node.coord[0] < 100) {
      candidate = { value, path: [...path, 0] }
    }
    // use filter to ensure index is correct (don't count preview node)
    node.children.filter((child) => !child.dropPreview).forEach((child, i) => traverse(child, [...path, i]))
  }

  rootView.children.filter((child) => !child.dropPreview).forEach((child, i) => traverse(child, [i]))

  return candidate.path
}
