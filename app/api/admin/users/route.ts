import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getCurrentUser()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all users with post count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the data
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "active", // Hardcoded for now
      createdAt: user.createdAt,
      blogCount: user._count.posts,
    }))

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

