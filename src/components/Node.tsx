import { append, assocPath, init, insert, last, lensPath, over } from 'ramda'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DndContext } from '../dnd-context'
import { NodeId, NodePath, Point, TreeNode, TreeNodeView } from '../model'
import { RootContext } from '../root-context'
import { getNodeStyle } from '../util/layout'
import { isRoot, newNode } from '../util/node'
import { add, sub } from '../util/point'
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

  const style = {
    ...getNodeStyle(node),
    height: node.size[1],
    border: '1px solid black',
    borderRadius: '5px',
    lineHeight: `${node.size[1]}px`,
    backgroundColor: 'white',
  }

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
      className="node"
      contentEditable={editing}
      style={style}
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
  const { node, path, getCoord } = props
  const [editing, setEditing] = useState(freshNodes.has(node.id))
  const exitEditing = useCallback(() => setEditing(false), [])
  const { root, setRoot } = useContext(RootContext)
  const { startDragging } = useContext(DndContext)

  useEffect(() => {
    // synchronously delete will make NodeBody editing=false, no idea why
    freshNodes.delete(node.id)
  }, [])

  function modifySelf(node: TreeNode) {
    setRoot(assocPath(path, node, root))
  }

  function createChild() {
    const nn = newNode(node.direction)
    freshNodes.add(nn.id)
    setRoot(over(lensPath(path.concat('children')), append(nn), root))
  }

  const [x, y] = [node.coord[0] - node.size[0] / 2, node.coord[1] - node.size[1] / 2]

  return (
    <>
      {node.children.map((child, i) => (
        <div key={child.id} className={child.dropPreview ? 'drop-preview' : ''}>
          <Connect parent={node} child={child} />
          <Node
            getCoord={getCoord}
            node={child}
            path={path.concat('children', i)}
          />
        </div>
      ))}
      <div
        className="node-wrap"
        style={{ position: 'absolute', top: y, left: x }}
        onKeyPressCapture={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (editing) {
              setEditing(false)
            } else {
              if (!e.shiftKey) {
                if (isRoot(node)) return
                const nn = newNode(node.direction)
                freshNodes.add(nn.id)
                setRoot(over(lensPath(init(path)), insert(last(path) as number, nn), root))
              } else {
                createChild()
              }
            }
          }
        }}
        tabIndex={-1}
        onMouseDown={(e) => {
          const offset = sub(node.coord, getCoord(e.clientX, e.clientY))
          startDragging(props.path, (x: number, y: number) => add(getCoord(x, y), offset))
        }}
        onDoubleClick={() => {
          if (!editing) {
            setEditing(true)
          }
        }}
      >
        <NodeBody editing={editing} node={node} onBlur={exitEditing} onChange={modifySelf}></NodeBody>
      </div>
    </>
  )
})
