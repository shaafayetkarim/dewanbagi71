import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: session.id as string,
      },
      include: {
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

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Get collections error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await req.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Create collection
    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: session.id as string,
      },
    })

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Create collection error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

