import produce from 'immer'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { ViewNode } from '../model'
import { getNodeStyle } from '../util/layout'
import { Connect } from './Connect'

interface Props {
  node: ViewNode
  onChange: (newNode: ViewNode) => void
  editing?: boolean
}

// persist caret position
const NodeBody = React.memo(function (props: Props) {
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
      range?.setStart(target!, start)
      range?.setEnd(target!, start)
      sel.removeAllRanges()
      sel.addRange(range!)
    }
  }, [start, editing])

  return (
    <div
      ref={el}
      className="node"
      contentEditable={editing}
      style={style}
      suppressContentEditableWarning
      onInput={(e) =>
        props.onChange(
          produce(node, (node) => {
            node.label = e.currentTarget.innerText
            saveCaret()
          })
        )
      }
    >
      {node.label}
    </div>
  )
})

export const Node = React.memo(function (props: Omit<Props, 'editing'>) {
  const [editing, setEditing] = useState(false)
  const { node } = props

  function onChildChange(index: number) {
    return (newNode: ViewNode) => {
      props.onChange(
        produce(node, (node) => {
          node.children[index] = newNode as any
        })
      )
    }
  }

  return (
    <>
      {node.children.map((child, i) => (
        <div key={child.id}>
          <Connect parent={node} child={child} />
          <Node node={child} onChange={onChildChange(i)} />
        </div>
      ))}
      <div
        onKeyPressCapture={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setEditing(false)
          }
        }}
        onBlur={() => setEditing(false)}
        onDoubleClick={() => {
          if (!editing) {
            setEditing(true)
          }
        }}
      >
        <NodeBody editing={editing} node={node} onChange={props.onChange}></NodeBody>
      </div>
    </>
  )
})
