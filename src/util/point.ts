import { Point, Vector } from '../model'

export function translate(point: Point, offset: Vector): Point {
  return [point[0] + offset[0], point[1] + offset[1]]
}

export function sub(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]]
}

export const add = translate

export function repr(p: Point) {
  return `${p[0]},${p[1]}`
}
