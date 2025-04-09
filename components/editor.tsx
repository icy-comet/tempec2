"use client"

import { useEffect, useState } from "react"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  // This prevents hydration issues with Quill
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] w-full border rounded-md" />
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "code-block"],
      ["clean"],
    ],
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      className="h-[400px] mb-12"
      placeholder="Write something..."
    />
  )
}
