import { findLastIndex, lensPath, over } from 'ramda'
import React, { CSSProperties, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { takeUntil } from 'rxjs/operators'
import { CanvasContext } from '../canvas-context'
import { DndContext } from '../dnd-context'
import { NodeId, NodePath, Point, TreeNode, TreeNodeView } from '../model'
import { mousemove$, mouseup$ } from '../util/event'
import { getNodeStyle } from '../util/layout'
import { isRoot, newNode } from '../util/node'
import { pathAppend, pathInsert, pathOver, pathSet } from '../util/path'
import { add, mul, sub } from '../util/point'
import { Connect } from './Connect'

// records freshly created node
const freshNodes = new Set<NodeId>()

interface NodeBodyProps {
  node: TreeNodeView
  onChange: (newNode: TreeNode) => void
  onBlur: () => void
  editing: boolean
}

interface NodeProps {
  node: TreeNodeView
  path: NodePath
  getCoord: (cx: number, cy: number) => Point
}

// persist caret position
const NodeBody = React.memo(function (props: NodeBodyProps) {
  const { node, editing } = props
  const [start, setStart] = useState(node.label.length)
  const el = useRef<HTMLDivElement | null>(null)

  function saveCaret() {
    setStart(window.getSelection()?.getRangeAt(0).startOffset ?? 0)
  }

  useLayoutEffect(() => {
    const sel = document.getSelection()
    if (editing && sel && el.current) {
      const range = new Range()
      // editable div occasionally have 2 text children, one empty
      // find the real one to restore caret position
      const target = Array.from(el.current.childNodes).find((node) => node.nodeValue)
      // when a node has no text, target would be undefined
      if (target) {
        range?.setStart(target!, start)
        range?.setEnd(target!, start)
        sel.removeAllRanges()
        sel.addRange(range!)
      }
    }
  }, [start, editing])

  return (
    <div
      ref={el}
      className="editor"
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={props.onBlur}
      onInput={(e) => {
        saveCaret()
        props.onChange({ ...node, label: e.currentTarget.innerText })
      }}
    >
      {node.label || ' ' /* use a space to visualize editing */}
    </div>
  )
})

export const Node = React.memo(function (props: NodeProps) {
  let { node, path, getCoord } = props
  const [editing, setEditing] = useState(freshNodes.has(node.id))
  const exitEditing = useCallback(() => setEditing(false), [])
  const { canvas, setCanvas } = useContext(CanvasContext)
  const { startDragging } = useContext(DndContext)
  const el = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    // synchronously delete will make NodeBody editing=false, no idea why
    freshNodes.delete(node.id)
  }, [])

  node = { ...node, expanded: node.expanded || node.children.some((child) => child.dropPreview) }

  function modifySelf(node: TreeNode) {
    setCanvas(pathSet(canvas, path, node))
  }

  function createChild() {
    const nn = newNode({ direction: node.direction })
    freshNodes.add(nn.id)
    const expanded = pathSet(canvas, path, { ...node, expanded: true })
    setCanvas(pathAppend(expanded, path, nn))
  }

  const [x, y] = sub(node.coord, mul(node.size, 0.5))

  const style: CSSProperties = {
    ...getNodeStyle(node),
    display: 'flex',
    alignItems: 'center',
    top: y,
    left: x,
    width: node.size[0],
    height: node.size[1],
  }

  return (
    <>
      <Connect
        parent={node}
        toggle={() => {
          modifySelf({ ...node, expanded: !node.expanded })
        }}
      />
      {node.expanded &&
        node.children.map((child, i) => (
          <div key={child.id} className={child.dropPreview ? 'drop-preview' : ''}>
            {child.summaries.map((summary, summaryIndex) => {
              const { top, left, right, bottom } = summary.rect
              return (
                <div
                  key={`${child.id}-${summary.count}`}
                  style={{
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${right - left}px`,
                    height: `${bottom - top}px`,
                    border: 'solid 2px black',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                    zIndex: -100,
                  }}
                >
                  <div
                    style={{ position: 'absolute', bottom: '-2px', height: '5px', cursor: 's-resize', width: '100%' }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      const childIndex = i
                      const self = (e.target as HTMLDivElement).parentElement
                      const startY = e.clientY
                      const initialHeight = self!.getBoundingClientRect().height
                      let endY = e.clientY
                      mousemove$.pipe(takeUntil(mouseup$)).subscribe({
                        next: (e) => {
                          self!.style.height = `${e.clientY - startY + initialHeight}px`
                          endY = e.clientY
                        },
                        complete: () => {
                          const [, y] = getCoord(0, endY)
                          const endIndex = Math.max(
                            summaryIndex,
                            findLastIndex((child) => child.coord[1] <= y, node.children)
                          )
                          setCanvas((canvas) =>
                            pathOver(
                              canvas,
                              [...path, childIndex],
                              over(lensPath(['summaries', summaryIndex, 'count']), () => endIndex - childIndex + 1)
                            )
                          )
                        },
                      })
                    }}
                  ></div>
                  {summary.label}
                </div>
              )
            })}
            <Node getCoord={getCoord} node={child} path={[...path, i]} />
          </div>
        ))}
      <div
        ref={el}
        className="node-wrap node"
        style={style}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (editing) {
              setEditing(false)
              el.current.focus()
            } else {
              if (isRoot(node)) {
                return createChild()
              }
              const nn = newNode()
              freshNodes.add(nn.id)
              setCanvas(pathInsert(canvas, path, nn))
            }
          } else if (e.key === 'Tab') {
            e.preventDefault()
            setEditing(false)
            createChild()
          }
        }}
        tabIndex={-1}
        onMouseDown={(e) => {
          if (editing) return
          const offset = sub(node.coord, getCoord(e.clientX, e.clientY))
          startDragging(props.path, (x: number, y: number) => add(getCoord(x, y), offset), [e.clientX, e.clientY])
        }}
        onDoubleClick={(e) => {
          if (editing) return
          e.stopPropagation()
          if (!editing) {
            setEditing(true)
          }
        }}
      >
        <div
          className="resizer"
          onMouseDown={(e) => {
            e.stopPropagation()
            const startX = e.clientX
            const initialWidth = el.current.getBoundingClientRect().width
            mousemove$.pipe(takeUntil(mouseup$)).subscribe((e) => {
              const newWidth = initialWidth + e.clientX - startX
              if (newWidth < 10) {
                return
              }
              setCanvas((canvas) => pathSet(canvas, path, { ...node, fixedWidth: newWidth }))
            })
          }}
        ></div>
        <NodeBody editing={editing} node={node} onBlur={exitEditing} onChange={modifySelf}></NodeBody>
      </div>
    </>
  )
})
