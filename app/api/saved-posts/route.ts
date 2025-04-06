import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: session.id as string,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      savedPosts: savedPosts.map((saved) => saved.post),
    })
  } catch (error) {
    console.error("Get saved posts error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

