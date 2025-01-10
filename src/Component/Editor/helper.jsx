import { EditorState } from "draft-js"

const createHandler = (type, sliceIndex) => (
  selectionState,
  contentState,
  block,
  text,
  blockKey,
  editorState
) => {
  const blockSelection = selectionState.merge({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: text.indexOf(" ") + 1
  })
  const updatedContentState = contentState.merge({
    blockMap: contentState.getBlockMap().merge({
      [blockKey]: block.merge({
        type: type,
        text: text.slice(sliceIndex)
      })
    })
  })
  const newEditorState = EditorState.push(
    editorState,
    updatedContentState,
    "change-block-data"
  )
  return EditorState.forceSelection(newEditorState, blockSelection)
}

export const boldHandler = createHandler("block-bold", 2)
export const headingHandler = createHandler("header-one", 2)
export const redColorHandler = createHandler("block-red", 3)
export const underlineHandler = createHandler("block-underline", 4)