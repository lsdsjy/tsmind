import { flatMap } from 'lodash-es'
import { append, init, insert, last, lensPath, over, path as ramdaPath, remove } from 'ramda'
import { Canvas, CanvasView, NodePath } from '../model'

type ElementType<T> = T extends (infer U)[] ? U : never

/**
 * [1, 2] => ['children', 1, 'children', 2]
 */
function interpolatedPath(path: NodePath): ('children' | number)[] {
  return flatMap(path, (i) => ['children', i])
}

function split<T>(list: T[]) {
  return [init(list), last(list)!] as const
}

function splitInterpolate(path: NodePath): readonly [('children' | number)[], number] {
  return split(interpolatedPath(path)) as any
}

type NodeType<T extends Canvas | CanvasView> = ElementType<T['children']>

export function pathOver<T extends Canvas | CanvasView>(
  canvas: T,
  path: NodePath,
  fn: (original: NodeType<T>) => NodeType<T>
) {
  return over(lensPath(interpolatedPath(path)), fn, canvas)
}

export function pathInsert<T extends Canvas | CanvasView>(canvas: T, path: NodePath, node: NodeType<T>) {
  const [children, index] = splitInterpolate(path)
  return over(lensPath(children), insert(index, node), canvas)
}

export function pathGet<T extends Canvas | CanvasView>(canvas: T, path: NodePath) {
  return ramdaPath(interpolatedPath(path), canvas)
}

export function pathSet<T extends Canvas | CanvasView>(canvas: T, path: NodePath, node: NodeType<T>) {
  return pathOver(canvas, path, () => node)
}

export function pathDelete<T extends Canvas | CanvasView>(canvas: T, path: NodePath) {
  const [children, index] = splitInterpolate(path)
  return over(lensPath(children), remove(index, 1), canvas)
}

export function pathAppend<T extends Canvas | CanvasView>(canvas: T, path: NodePath, node: NodeType<T>) {
  return over(lensPath(interpolatedPath(path).concat('children')), append(node), canvas)
}
