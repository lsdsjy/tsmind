import { useForceUpdate } from 'observable-hooks'
import { append, init, lensProp, over } from 'ramda'
import React, { SetStateAction, useCallback, useMemo, useRef } from 'react'
import { last, map, materialize, skipWhile, takeUntil, tap } from 'rxjs/operators'
import './App.css'
import { CanvasContext } from './canvas-context'
import { MindMap } from './components/Map'
import { DndContext } from './dnd-context'
import mockCanvas from './mock'
import { Canvas, CanvasView, NodePath, Point, TreeNodeView, Vector } from './model'
import { getDropTarget } from './util/dnd'
import { mousemove$, mouseup$ } from './util/event'
import { layOutCanvas } from './util/layout'
import { toggleExpanded } from './util/node'
import { pathDelete, pathGet, pathInsert, pathOver } from './util/path'
import { edist } from './util/point'
import { tapOnce } from './util/tap-once'

let undoStack: Canvas[] = []
let redoStack: Canvas[] = []

function App() {
  const canvas = useRef<Canvas>(mockCanvas)
  const view = useMemo(() => layOutCanvas(canvas.current), [canvas.current])
  const preview = useRef<CanvasView>()
  const forceUpdate = useForceUpdate()

  function setCanvas(value: SetStateAction<Canvas>) {
    canvas.current = typeof value === 'function' ? value(canvas.current) : value
    forceUpdate()
  }

  function setPreview(value: typeof preview['current']) {
    preview.current = value
    forceUpdate()
  }

  const startDragging = useCallback(
    (path: NodePath, getCoord: (x: number, y: number) => Vector, start: Point) => {
      const source = pathGet(view, path) as TreeNodeView

      const dragCoord$ = mousemove$.pipe(
        takeUntil(mouseup$),
        skipWhile((e) => edist([e.clientX, e.clientY], start) < 10),
        map((e) => getCoord(e.clientX, e.clientY))
      )

      dragCoord$
        .pipe(
          tapOnce(() => {
            preview.current = pathDelete(view, path)
            canvas.current = pathDelete(canvas.current, path)
          }),
          map((coord) => [coord, getDropTarget(preview.current!, coord)] as const),
          tap(([coord, target]) => {
            if (target) {
              canvas.current = pathOver(canvas.current, init(target), toggleExpanded(true))
            }
            let previewCanvas = canvas.current
            if (target) {
              previewCanvas = pathInsert(previewCanvas, target, {
                ...source,
                children: [],
                dropPreview: true,
                root: undefined,
              })
            }
            setPreview({
              ...layOutCanvas(previewCanvas),
              dragSource: { ...source, coord, children: [] },
              dropTarget: target,
            })
          }),
          last(),
          materialize()
        )
        .subscribe((notification) => {
          if (notification.kind === 'N') {
            update((oldCanvas) => {
              let canvas = oldCanvas
              const [, target] = notification.value!
              if (target) {
                canvas = pathOver(canvas, init(target), (parent) => ({ ...parent, expanded: true }))
                return pathInsert(canvas, target, source)
              } else {
                return over(
                  lensProp('children'),
                  append({ ...source, coord: preview.current!.dragSource!.coord, root: true }),
                  canvas
                )
              }
            })
          }
          setPreview(undefined)
        })
    },
    [canvas.current]
  )

  const update: typeof setCanvas = (args: any) => {
    undoStack.push(canvas.current)
    redoStack = []
    return setCanvas(args)
  }

  function undo() {
    const last = undoStack.pop()
    if (last) {
      redoStack.push(canvas.current)
      setCanvas(last)
    }
  }

  function redo() {
    const next = redoStack.pop()
    if (next) {
      undoStack.push(canvas.current)
      setCanvas(next)
    }
  }

  return (
    <CanvasContext.Provider value={{ canvas: canvas.current, setCanvas: update }}>
      <DndContext.Provider value={{ startDragging }}>
        <div className="App">
          <button onClick={undo}>undo</button>
          <button onClick={redo}>redo</button>
          <MindMap canvas={preview.current ?? view} />
        </div>
      </DndContext.Provider>
    </CanvasContext.Provider>
  )
}

export default App
