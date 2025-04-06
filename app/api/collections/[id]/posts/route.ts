import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const collection = await prisma.collection.findUnique({
      where: { id: params.id }
    })
    
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Check if user is the owner
    if (collection.userId !== session.id && session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const { postId } = await req.json()
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }
    
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Check if post is already in collection
    if (collection.postIds.includes(postId)) {
      // Remove post from collection
      const updatedCollection = await prisma.collection.update({
        where: { id: params.id },
        data: {
          posts: {
            disconnect: {
              id: postId
            }
          }
        }
      })
      
      return NextResponse.json({ 
        collection: updatedCollection,
        added: false
      })
    }
    
    // Add post to collection
    const updatedCollection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        posts: {
          connect: {
            id: postId
          }
        }
      }
    })
    
    return NextResponse.json({ 
      collection: updatedCollection,
      added: true
    })
  } catch (error) {
    console.error('Add/remove post to/from collection error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },\
      { status:  error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

