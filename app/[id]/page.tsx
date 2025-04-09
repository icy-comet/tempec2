"use client"

import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import "react-quill-new/dist/quill.snow.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface Paste {
  id: string
  content: string
  createdAt: string
}

export default function PastePage({ params }: { params: { id: string } }) {
  const [paste, setPaste] = useState<Paste | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/paste?id=${params.id}`)

        if (!response.ok) {
          throw new Error("Paste not found")
        }

        const data = await response.json()
        setPaste(data)
      } catch (err) {
        setError("Failed to load paste")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPaste()
  }, [params.id])

  const goBack = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="animate-pulse bg-gray-200 h-8 w-1/3 rounded"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !paste) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-700">{error || "Paste not found"}</div>
            <Button onClick={goBack} className="mt-4">
              Back to Editor
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Paste {params.id.substring(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(paste.createdAt))} ago
            </p>
          </div>
          <Button variant="outline" onClick={goBack}>
            Create New Paste
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <div className="ql-snow">
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: paste.content }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
