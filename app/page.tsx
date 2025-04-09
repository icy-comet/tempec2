"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Dynamically import the Editor to avoid SSR issues with Quill
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full border rounded-md bg-gray-50 animate-pulse" />,
})

export default function Home() {
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)
  const router = useRouter()

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/paste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to save paste")
      }

      const data = await response.json()
      setSavedUrl(data.url)
    } catch (error) {
      console.error("Failed to save paste:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewSaved = () => {
    if (savedUrl) {
      router.push(savedUrl)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Simple Pastebin</CardTitle>
          <CardDescription>Create and share text snippets with rich formatting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Editor value={content} onChange={setContent} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Paste"
            )}
          </Button>

          {savedUrl && (
            <div className="flex items-center gap-2">
              <span className="text-green-600">Saved!</span>
              <Button variant="outline" onClick={handleViewSaved}>
                View Paste
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
