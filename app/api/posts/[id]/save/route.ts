import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if already saved
    const existingSave = await prisma.savedPost.findFirst({
      where: {
        userId: session.id as string,
        postId: params.id,
      },
    })

    if (existingSave) {
      // If already saved, unsave it
      await prisma.savedPost.delete({
        where: { id: existingSave.id },
      })

      return NextResponse.json({ saved: false })
    }

    // Save the post
    await prisma.savedPost.create({
      data: {
        userId: session.id as string,
        postId: params.id,
      },
    })

    return NextResponse.json({ saved: true })
  } catch (error) {
    console.error("Save post error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

