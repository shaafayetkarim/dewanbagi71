import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, postId } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Check if user has generations left
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.generationsLeft <= 0 && user.subscription === "free") {
      return NextResponse.json(
        { error: "You have reached your generation limit. Please upgrade to premium." },
        { status: 403 },
      )
    }

    // In a real app, you would call an AI service here
    // For now, we'll just add some content
    const improvedContent =
      content +
      "\n\n" +
      "## Additional Insights\n\n" +
      "This section was added by our AI assistant to enhance your content. " +
      "It provides additional context and insights on the topic, making your blog post more comprehensive and valuable to readers.\n\n" +
      "- The topic you're discussing has significant implications for the industry\n" +
      "- Recent research shows growing interest in this area\n" +
      "- Experts recommend implementing these ideas gradually for best results"

    // Decrement generations left if user is on free plan
    if (user.subscription === "free") {
      await prisma.user.update({
        where: { id: session.id as string },
        data: {
          generationsLeft: {
            decrement: 1,
          },
        },
      })
    }

    // If postId is provided, update the post
    if (postId) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          content: improvedContent,
          wordCount: improvedContent.split(/\s+/).length,
        },
      })
    }

    return NextResponse.json({ improvedContent })
  } catch (error) {
    console.error("Improve content error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

