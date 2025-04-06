import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await req.json()

    if (!role || !["admin", "premium", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Update user role error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

