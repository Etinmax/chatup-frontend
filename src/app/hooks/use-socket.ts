import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  onMessageReceive: (callback: (message: Message) => void) => void;
  onUserOnline: (callback: (users: string[]) => void) => void;
}

export function useSocket(): UseSocketReturn {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messageCallbackRef = useRef<((message: Message) => void) | null>(null);
  const onlineCallbackRef = useRef<((users: string[]) => void) | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Connect to Socket.IO server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      
      // Register user with their database ID
      newSocket.emit("user:register", session.user.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for incoming messages
    newSocket.on("message:receive", (message: Message) => {
      console.log("📨 Message received:", message);
      if (messageCallbackRef.current) {
        messageCallbackRef.current(message);
      }
    });

    // Listen for message sent confirmation
    newSocket.on("message:sent", (message: Message) => {
      console.log("✅ Message sent confirmation:", message);
      if (messageCallbackRef.current) {
        messageCallbackRef.current(message);
      }
    });

    // Listen for online users updates
    newSocket.on("users:online", (users: string[]) => {
      console.log("👥 Online users updated:", users.length);
      setOnlineUsers(users);
      if (onlineCallbackRef.current) {
        onlineCallbackRef.current(users);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session?.user?.id]);

  const sendMessage = async (receiverId: string, text: string) => {
    if (!socket || !session?.user?.id) return;

    try {
      // Save to database first
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, text })
      });

      if (!response.ok) throw new Error("Failed to save message");

      const message = await response.json();

      // Then send via socket for real-time delivery
      socket.emit("message:send", {
        senderId: session.user.id,
        receiverId,
        text,
        messageId: message.id
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onMessageReceive = (callback: (message: Message) => void) => {
    messageCallbackRef.current = callback;
  };

  const onUserOnline = (callback: (users: string[]) => void) => {
    onlineCallbackRef.current = callback;
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    onMessageReceive,
    onUserOnline
  };
}
{/*import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  onMessageReceive: (callback: (message: Message) => void) => void;
  onUserOnline: (callback: (users: string[]) => void) => void;
}

export function useSocket(): UseSocketReturn {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messageCallbackRef = useRef<((message: Message) => void) | null>(null);
  const onlineCallbackRef = useRef<((users: string[]) => void) | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Connect to Socket.IO server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      
      // Register user with their database ID
      newSocket.emit("user:register", session.user.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for incoming messages
    newSocket.on("message:receive", (message: Message) => {
      console.log("📨 Message received:", message);
      if (messageCallbackRef.current) {
        messageCallbackRef.current(message);
      }
    });

    // Listen for message sent confirmation
    newSocket.on("message:sent", (message: Message) => {
      console.log("✅ Message sent confirmation:", message);
      if (messageCallbackRef.current) {
        messageCallbackRef.current(message);
      }
    });

    // Listen for online users updates
    newSocket.on("users:online", (users: string[]) => {
      console.log("👥 Online users updated:", users.length);
      setOnlineUsers(users);
      if (onlineCallbackRef.current) {
        onlineCallbackRef.current(users);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session?.user?.id]);

  const sendMessage = async (receiverId: string, text: string) => {
    if (!socket || !session?.user?.id) return;

    try {
      // Save to database first
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, text })
      });

      if (!response.ok) throw new Error("Failed to save message");

      const message = await response.json();

      // Then send via socket for real-time delivery
      socket.emit("message:send", {
        senderId: session.user.id,
        receiverId,
        text,
        messageId: message.id
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onMessageReceive = (callback: (message: Message) => void) => {
    messageCallbackRef.current = callback;
  };

  const onUserOnline = (callback: (users: string[]) => void) => {
    onlineCallbackRef.current = callback;
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    onMessageReceive,
    onUserOnline
  };
}*/}