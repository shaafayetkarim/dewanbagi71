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

    // Increment likes
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

