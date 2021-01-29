import { useForceUpdate } from 'observable-hooks'
import { append, lensProp, over } from 'ramda'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { fromEvent, Observable } from 'rxjs'
import { last, map, materialize, skipWhile, takeUntil, tap } from 'rxjs/operators'
import './App.css'
import { CanvasContext } from './canvas-context'
import { MindMap } from './components/Map'
import { DndContext } from './dnd-context'
import mockCanvas from './mock'
import { Canvas, CanvasView, NodePath, Point, TreeNodeView, Vector } from './model'
import { getDropTarget } from './util/dnd'
import { layOutCanvas } from './util/layout'
import { pathDelete, pathGet, pathInsert } from './util/path'
import { edist } from './util/point'

const mousemove$: Observable<MouseEvent> = fromEvent(document, 'mousemove') as any
const mouseup$ = fromEvent(document, 'mouseup')

let undoStack: Canvas[] = []
let redoStack: Canvas[] = []

function App() {
  const [canvas, setCanvas] = useState(mockCanvas)
  const view = useMemo(() => layOutCanvas(canvas), [canvas])
  const preview = useRef<CanvasView>()
  const forceUpdate = useForceUpdate()

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
          map((coord) => [coord, getDropTarget(preview.current ?? pathDelete(view, path), coord)] as const),
          tap(([coord, target]) => {
            let previewCanvas = pathDelete(canvas, path)
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
              const canvas = pathDelete(oldCanvas, path)
              const [, target] = notification.value!
              if (target) {
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
    [canvas]
  )

  const update: typeof setCanvas = (args: any) => {
    undoStack.push(canvas)
    redoStack = []
    return setCanvas(args)
  }

  function undo() {
    const last = undoStack.pop()
    if (last) {
      redoStack.push(canvas)
      setCanvas(last)
    }
  }

  function redo() {
    const next = redoStack.pop()
    if (next) {
      undoStack.push(canvas)
      setCanvas(next)
    }
  }

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas: update }}>
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
