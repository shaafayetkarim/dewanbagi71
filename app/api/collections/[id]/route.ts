import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        posts: {
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
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Check if user is the owner
    if (collection.userId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Get collection error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Check if user is the owner
    if (collection.userId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, description } = await req.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Update collection
    const updatedCollection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json({ collection: updatedCollection })
  } catch (error) {
    console.error("Update collection error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Check if user is the owner
    if (collection.userId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete collection
    await prisma.collection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete collection error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

