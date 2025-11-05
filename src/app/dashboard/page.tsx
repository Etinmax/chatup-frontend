"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Search,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import UserList from "@/components/user-list";
import ChatWindow from "@/components/chat-window";
import { useChat } from "@/app/hooks/use-chat";
import Sidebar from "@/components/sidebar";
import MessageInput from "@/components/message-input";

export default function ChatDashboard() {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { users, messages, loading, isConnected, sendMessage, fetchMessages } = useChat();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = selectedUser ? users.find((u) => u.id === selectedUser) : null;
  const chatMessages = selectedUser ? messages[selectedUser] || [] : [];

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  }, [selectedUser, fetchMessages]);

  const handleSendMessage = async (text: string) => {
    if (text.trim() && selectedUser) {
      await sendMessage(selectedUser, text);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  // Protect dashboard route
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            {/*<Send className="w-8 h-8 text-primary" />*/}
            <img src="cu.png" alt="" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ChatUp</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your messages</p>
          <Button
            onClick={() => (window.location.href = "/api/auth/signin")}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-primary-foreground"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* User List */}
      <aside
        className={`flex flex-col w-full sm:w-80 lg:w-96 border-r border-border bg-card transition-all duration-300 ${
          isSidebarOpen ? "block" : selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Messages</h1>
            {/* Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background h-9 sm:h-10"
            />
          </div>
        </div>

        {/* User List Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading conversations...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <UserList
              users={filteredUsers}
              selectedUserId={selectedUser}
              onSelectUser={handleSelectUser}
              currentUserId={session.user?.id}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No users found" : "No conversations yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`flex-1 flex flex-col ${!selectedUser && "hidden md:flex"}`}>
        {currentChat ? (
          <>
            {/* Chat Header */}
            <header className="flex-shrink-0 border-b border-border bg-card p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                  <AvatarImage src={currentChat.avatar || "/placeholder.svg"} alt={currentChat.name} />
                  <AvatarFallback>{currentChat.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">
                      {currentChat.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      {currentChat.isOnline ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                          <span>Active now</span>
                        </>
                      ) : (
                        <span>Offline</span>
                      )}
                    </p>
                  </div>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                messages={chatMessages}
                currentUser={currentChat}
                currentUserId={session.user?.id}
              />
            </div>

            {/* Message Input */}
            <footer className="flex-shrink-0 border-t border-border bg-card p-3 sm:p-4">
              <MessageInput onSend={handleSendMessage} />
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              <Button
                variant="outline"
                size="lg"
                className="md:hidden mb-6"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-4 h-4 mr-2" />
                View Conversations
              </Button>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                {/*<Send className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground " />*/}
                <img src="cu.png" alt="" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Select a conversation
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Choose a user from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
