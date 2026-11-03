import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials", 
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
    async authorize(credentials){
        if (!credentials?.email || !credentials?.password) {
            throw new Error("Invaild credentials");
        }

    const user = await prisma.user.findUnique({
        where: {email: credentials.email as string},
        include: { subscription: true },
    });

    if(!user || !user.password) throw new Error("Invaild credentials");

    const isPasswordValid = await bcrypt.compare(
        credentials.password as string,
        user.password
    );

     if(!isPasswordValid) throw new Error("Invaild credentials");

     return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
     };   

    }, 
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name;
                token.email = user.email;
            }
    if (trigger === "update" || user) {
        const updatedUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              name: true, email: true, role: true,
              subscription: { select: { planType: true, isActive: true, endDate: true}}  
            },
        });

    if (updatedUser) {
       token.name = updatedUser.name;
       token.email = updatedUser.email;
       token.role = updatedUser.role;
       token.subscription = updatedUser.subscription;
    } 

    }

    return token; 
   },
  /// Work for Session 

  async session({ session, token }) {
    if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).subscription = token.subscription;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
    }
    return session;
  }, 
    },

    pages: {
        signIn: "/signin",
        signOut: "/signout",
        error: "/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
});