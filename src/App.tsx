import { isEqual } from 'lodash-es'
import { assocPath, init, insert, last, lensPath, over, path as pathGet, remove, view } from 'ramda'
import React, { useCallback, useMemo, useState } from 'react'
import { concat, fromEvent, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, last as takeLast, map, startWith, takeUntil, tap } from 'rxjs/operators'
import './App.css'
import { MindMap } from './components/Map'
import { DndContext } from './dnd-context'
import mockRoot from './mock'
import { NodePath, TreeNode, TreeNodeView, Vector } from './model'
import { RootContext } from './root-context'
import { getDropTarget } from './util/dnd'
import { layOutRoot } from './util/layout'

const mousemove$: Observable<MouseEvent> = fromEvent(document, 'mousemove') as any
const mouseup$ = fromEvent(document, 'mouseup')

let undoStack: TreeNode[] = []
let redoStack: TreeNode[] = []

/**
 * 相当于 useRef
 */
let previewState: TreeNodeView | undefined

function App() {
  const [root, setRoot] = useState(mockRoot)
  const [dragSource, setDragSource] = useState<TreeNodeView>()
  const [dropTargetPath, setDropTargetPath] = useState<NodePath>()
  const rootView = useMemo(() => layOutRoot(root), [root])
  const [preview, setPreview] = useState<TreeNodeView>()

  const startDragging = useCallback(
    (path: NodePath, getCoord: (x: number, y: number) => Vector) => {
      const lens = lensPath(path)
      const source = view(lens, rootView) as TreeNodeView
      setDragSource(source)
      const dragCoord$ = concat(
        mousemove$.pipe(
          takeUntil(mouseup$),
          map((e) => getCoord(e.clientX, e.clientY))
        ),
        of(undefined)
      )
      dragCoord$.subscribe((coord) => {
        if (coord) {
          setDragSource((node) => ({ ...node!, coord }))
        }
      })
      dragCoord$
        .pipe(
          filter((coord) => !!coord) as any,
          map((coord: Vector) => previewState && getDropTarget(previewState, coord)),
          distinctUntilChanged((a, b) => isEqual(a, b)),
          startWith(undefined),
          tap((target) => {
            let previewRoot = over(lensPath(init(path)), remove(last(path) as number, 1), root)
            if (target) {
              const childrenPath = init(target)
              if (!pathGet(childrenPath, previewRoot)) {
                previewRoot = assocPath(childrenPath, [], previewRoot)
              }
              previewRoot = over(
                lensPath(childrenPath),
                insert(last(target) as number, { ...source, children: [], dropPreview: true }),
                previewRoot
              )
            }
            previewState = layOutRoot(previewRoot)
            setPreview(previewState)
            setDropTargetPath(target)
          }),
          takeLast()
        )
        .subscribe((target) => {
          if (target) {
            setRoot((root) => {
              let newRoot = over(lensPath(init(path)), remove(last(path) as number, 1), root)
              return over(lensPath(init(target)), insert(last(target) as number, source), newRoot)
            })
          }
          setPreview(undefined)
          setDragSource(undefined)
          setDropTargetPath(undefined)
        })
    },
    [root]
  )

  function update(newRoot: TreeNode) {
    undoStack.push(root)
    redoStack = []
    setRoot(newRoot)
  }

  function undo() {
    const last = undoStack.pop()
    if (last) {
      redoStack.push(root)
      setRoot(last)
    }
  }

  function redo() {
    const next = redoStack.pop()
    if (next) {
      undoStack.push(root)
      setRoot(next)
    }
  }

  return (
    <RootContext.Provider value={{ root, setRoot }}>
      <DndContext.Provider value={{ startDragging }}>
        <div className="App">
          <button onClick={undo}>undo</button>
          <button onClick={redo}>redo</button>
          <MindMap
            root={preview ?? rootView}
            onChange={update}
            dragSource={preview && dragSource && !dropTargetPath ? { ...dragSource, children: [] } : undefined}
          />
        </div>
      </DndContext.Provider>
    </RootContext.Provider>
  )
}

export default App
