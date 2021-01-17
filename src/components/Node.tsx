import produce from 'immer'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Node as NodeModel, ViewNode } from '../model'
import { getNodeStyle } from '../util/layout'
import { isRoot, newNode } from '../util/node'
import { Connect } from './Connect'

// records freshly created node
const freshNodes = new Set<NodeModel['id']>()

interface NodeBodyProps {
  node: ViewNode
  onChange: (newNode: ViewNode) => void
  onBlur: () => void
  editing: boolean
}

interface NodeProps {
  node: ViewNode
  onChange: (newNode: ViewNode) => void
  onCreateSibling: (newNode: NodeModel) => void
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
      onInput={(e) =>
        props.onChange(
          produce(node, (node) => {
            node.label = e.currentTarget.innerText
            saveCaret()
          })
        )
      }
    >
      {node.label || ' ' /* use a space to visualize editing */}
    </div>
  )
})

export const Node = React.memo(function (props: NodeProps) {
  const { node } = props
  const [editing, setEditing] = useState(freshNodes.has(node.id))
  const exitEditing = useCallback(() => setEditing(false), [])

  useEffect(() => {
    // synchronously delete will make NodeBody editing=false, no idea why
    freshNodes.delete(node.id)
  }, [])

  function mutateChild(index: number) {
    return (newNode: ViewNode) => {
      props.onChange(
        produce(node, (node) => {
          node.children[index] = newNode as any
        })
      )
    }
  }

  function createSibling(index: number) {
    return (newNode: NodeModel) => {
      props.onChange(
        produce(node, (node) => {
          node.children.splice(index, 0, newNode as any)
        })
      )
    }
  }

  return (
    <>
      {node.children.map((child, i) => (
        <div key={child.id}>
          <Connect parent={node} child={child} />
          <Node node={child} onChange={mutateChild(i)} onCreateSibling={createSibling(i)} />
        </div>
      ))}
      <div
        className="node-wrap"
        onKeyPressCapture={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (editing) {
              setEditing(false)
            } else if (!isRoot(node)) {
              const nn = newNode(node.direction)
              freshNodes.add(nn.id)
              props.onCreateSibling(nn)
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
        <NodeBody editing={editing} node={node} onBlur={exitEditing} onChange={props.onChange}></NodeBody>
      </div>
    </>
  )
})
