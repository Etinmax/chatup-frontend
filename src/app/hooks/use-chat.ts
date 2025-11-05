import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "./use-socket";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio?: string;
  isOnline: boolean;
  lastSeen: Date;
  lastMessage?: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    isSent: boolean;
  } | null;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
  sender?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export function useChat() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  
  const { 
    isConnected, 
    onlineUsers, 
    sendMessage: socketSendMessage,
    onMessageReceive,
    onUserOnline
  } = useSocket();

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a specific user
  const fetchMessages = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [userId]: data
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Update user online status based on socket data
  useEffect(() => {
    setUsers(prevUsers => 
      prevUsers.map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user.id)
      }))
    );
  }, [onlineUsers]);

  // Listen for incoming messages
  useEffect(() => {
    onMessageReceive((message) => {
      const otherUserId = message.senderId === session?.user?.id 
        ? message.receiverId 
        : message.senderId;

      setMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message]
      }));

      // Update last message in user list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === otherUserId
            ? {
                ...user,
                lastMessage: {
                  text: message.text,
                  timestamp: new Date(message.createdAt),
                  isRead: message.isRead,
                  isSent: message.senderId === session?.user?.id
                }
              }
            : user
        )
      );
    });
  }, [onMessageReceive, session?.user?.id]);

  // Initial data fetch
  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session?.user, fetchUsers]);

  const sendMessage = async (receiverId: string, text: string) => {
    if (!session?.user?.id) return;

    try {
      await socketSendMessage(receiverId, text);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    users,
    messages,
    loading,
    isConnected,
    sendMessage,
    fetchMessages,
    refreshUsers: fetchUsers
  };
}