import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth"; // ✅ CORRECT path for your setup

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
