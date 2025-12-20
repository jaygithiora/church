import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

const ReadOnlyArticle = ({ content }) => {
  const editor = useEditor({
    editable: false,  // important: disables editing
    extensions: [
      StarterKit,
      Image,
      Link,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,  // pass the JSON content here
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}

export default ReadOnlyArticle
