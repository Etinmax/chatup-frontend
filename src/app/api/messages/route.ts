// app/api/messages/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

// GET messages between current user and another user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    // Fetch all messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// POST - Send a new message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { receiverId, text } = body

    if (!receiverId || !text) {
      return new NextResponse("Receiver ID and text are required", { status: 400 })
    }

    // Create the message in database
    const message = await prisma.message.create({
      data: {
        text,
        senderId: session.user.id,
        receiverId,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// PATCH - Mark messages as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { senderId } = body

    if (!senderId) {
      return new NextResponse("Sender ID is required", { status: 400 })
    }

    // Mark all messages from sender as read
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating messages:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}