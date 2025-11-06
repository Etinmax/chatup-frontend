import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// Define expected user type from Prisma query
interface UserWithLastMessage {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  isOnline: boolean;
  lastSeen: Date | null;
  sentMessages: {
    text: string;
    createdAt: Date;
    isRead: boolean;
    senderId: string;
  }[];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        email: {
          not: session.user.email
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        sentMessages: {
          where: {
            OR: [
              { receiverId: session.user.id },
              { senderId: session.user.id }
            ]
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1,
          select: {
            text: true,
            createdAt: true,
            isRead: true,
            senderId: true
          }
        }
      },
      orderBy: {
        lastSeen: "desc"
      }
    }) as UserWithLastMessage[];

    // ✅ FIXED: user is now typed, no "implicitly any"
    const formattedUsers = users.map((user: UserWithLastMessage) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email,
      avatar: user.image,
      bio: user.bio,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      lastMessage: user.sentMessages[0]
        ? {
            text: user.sentMessages[0].text,
            timestamp: user.sentMessages[0].createdAt,
            isRead: user.sentMessages[0].isRead,
            isSent: user.sentMessages[0].senderId === session.user.id
          }
        : null
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


{/*import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Your NextAuth config
import { prisma } from "@/app/lib/prisma"; // Your Prisma client

export async function GET() {
  try {
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users except the current user
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: session.user.email
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        // Get last message with this user
        sentMessages: {
          where: {
            OR: [
              { receiverId: session.user.id },
              { senderId: session.user.id }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            text: true,
            createdAt: true,
            isRead: true,
            senderId: true
          }
        }
      },
      orderBy: {
        lastSeen: 'desc'
      }
    });

    // Format response
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email,
      avatar: user.image,
      bio: user.bio,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      lastMessage: user.sentMessages[0] ? {
        text: user.sentMessages[0].text,
        timestamp: user.sentMessages[0].createdAt,
        isRead: user.sentMessages[0].isRead,
        isSent: user.sentMessages[0].senderId === session.user.id
      } : null
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}*/}