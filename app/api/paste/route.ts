import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { savePaste, getPaste } from "@/lib/dynamodb"

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Generate a unique ID for the paste
    const id = uuidv4()

    // Save to DynamoDB
    await savePaste(id, content)

    // Return the URL for the saved paste
    const url = `/${id}`

    return NextResponse.json({ id, url })
  } catch (error) {
    console.error("Error saving paste:", error)
    return NextResponse.json({ error: "Failed to save paste" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Paste ID is required" }, { status: 400 })
  }

  try {
    const paste = await getPaste(id)

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    return NextResponse.json(paste)
  } catch (error) {
    console.error("Error retrieving paste:", error)
    return NextResponse.json({ error: "Failed to retrieve paste" }, { status: 500 })
  }
}
