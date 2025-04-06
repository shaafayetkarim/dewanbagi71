import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getCurrentUser()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get premium users
    const premiumUsers = await prisma.user.count({
      where: { subscription: "premium" },
    })

    // Get total blogs
    const totalBlogs = await prisma.post.count()

    // Get blogs generated today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const blogsGeneratedToday = await prisma.post.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    return NextResponse.json({
      totalUsers,
      premiumUsers,
      totalBlogs,
      blogsGeneratedToday,
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

