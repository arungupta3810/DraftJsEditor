import { useEffect, useRef, useState } from "react"
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js"
import { headingHandler, underlineHandler, redColorHandler, boldHandler } from "./helper.jsx"
import './style.scss'

const TextEditor = () => {
  const [currentEditorState, setCurrentEditorState] = useState(EditorState.createEmpty())
  const editorElementRef = useRef(null)

  useEffect(() => {
    const storedContent = localStorage.getItem("editorContent")
    if (storedContent) {
      const contentState = convertFromRaw(JSON.parse(storedContent))
      setCurrentEditorState(EditorState.createWithContent(contentState))
    }
  }, [])

  const handleSaveText = (event) => {
    event.preventDefault()
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(currentEditorState.getCurrentContent()))
    )
  }

  const getBlockStyle = (contentBlock) => {
    const blockType = contentBlock.getType()
    switch (blockType) {
      case "block-bold":
        return "BoldText"
      case "block-red":
        return "RedText"
      case "block-underline":
        return "UnderlineText"
      default:
        return null
    }
  }

  const handleEditorChange = (newEditorState) => {
    const selectionState = newEditorState.getSelection()
    const contentState = newEditorState.getCurrentContent()
    const currentBlock = contentState.getBlockForKey(selectionState.getStartKey())
    const blockText = currentBlock.getText()

    let updatedEditorState = newEditorState

    if (blockText.startsWith("# ")) {
      updatedEditorState = headingHandler(selectionState, contentState, currentBlock, blockText, currentBlock.getKey(), newEditorState)
    } else if (blockText.startsWith("*** ")) {
      updatedEditorState = underlineHandler(selectionState, contentState, currentBlock, blockText, currentBlock.getKey(), newEditorState)
    } else if (blockText.startsWith("** ")) {
      updatedEditorState = redColorHandler(selectionState, contentState, currentBlock, blockText, currentBlock.getKey(), newEditorState)
    } else if (blockText.startsWith("* ")) {
      updatedEditorState = boldHandler(selectionState, contentState, currentBlock, blockText, currentBlock.getKey(), newEditorState)
    }

    setCurrentEditorState(updatedEditorState)
  }

  return (
    <>
      <div className="container">
        <h2 className="title">Demo editor by Arun Gupta</h2>
        <button onClick={handleSaveText} className="Button">
          Save Text
        </button>
      </div>
      <div
        onClick={() => editorElementRef.current && editorElementRef.current.focus()}
        className="editor-container"
      >
        <Editor
          ref={editorElementRef}
          editorState={currentEditorState}
          onChange={handleEditorChange}
          blockStyleFn={getBlockStyle}
        />
      </div>
    </>
  )
}

export default TextEditor
