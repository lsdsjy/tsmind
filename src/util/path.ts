import { flatMap } from 'lodash-es'
import { append, init, insert, last, lensPath, over, remove, path as ramdaPath } from 'ramda'
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

export function pathInsert<T extends Canvas | CanvasView>(canvas: T, path: NodePath, node: ElementType<T['children']>) {
  const [children, index] = splitInterpolate(path)
  return over(lensPath(children), insert(index, node), canvas)
}

export function pathGet<T extends Canvas | CanvasView>(canvas: T, path: NodePath) {
  return ramdaPath(interpolatedPath(path), canvas)
}

export function pathDelete<T extends Canvas | CanvasView>(canvas: T, path: NodePath) {
  const [children, index] = splitInterpolate(path)
  return over(lensPath(children), remove(index, 1), canvas)
}

export function pathAppend<T extends Canvas | CanvasView>(canvas: T, path: NodePath, node: ElementType<T['children']>) {
  return over(lensPath(interpolatedPath(path).concat('children')), append(node), canvas)
}
