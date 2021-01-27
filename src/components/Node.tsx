import { append, assocPath, init, insert, last, lensPath, over } from 'ramda'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Node as NodeModel, ViewNode } from '../model'
import { RootContext } from '../root-context'
import { NodeId, NodePath, TreeNode, TreeNodeView } from '../model'
import { getNodeStyle } from '../util/layout'
import { isRoot, newNode } from '../util/node'
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
}

// persist caret position
const NodeBody = React.memo(function (props: NodeBodyProps) {
  const { node, editing } = props
  const [start, setStart] = useState(node.label.length)
  const el = useRef<HTMLDivElement | null>(null)

  const [x, y] = [node.coord[0] - node.size[0] / 2, node.coord[1] - node.size[1] / 2]
  const style = {
    ...getNodeStyle(node),
    height: node.size[1],
    top: y,
    left: x,
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
  const { node, path } = props
  const [editing, setEditing] = useState(freshNodes.has(node.id))
  const exitEditing = useCallback(() => setEditing(false), [])
  const { root, setRoot } = useContext(RootContext)

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

  return (
    <>
      {node.children.map((child, i) => (
        <div key={child.id}>
          <Connect parent={node} child={child} />
          <Node node={child} path={props.path.concat('children', i)} />
        </div>
      ))}
      <div
        className="node-wrap"
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
