import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";


export async function GET(req: NextRequest) {
try {

    const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        // Check if user is admin
        const userRole = (session.user as any).role;
        if (userRole !== Role.ADMIN) {
            return NextResponse.json({error: "Forbidden - Admin Access required"}, { status: 403});
        }

    // Get all users with their subscriptions and usage 
    const users = await prisma.user.findMany({
        include: {
           subscription: true,
           _count: {
            select: {
                reports: true,
                usage: true
            },           
           }, 
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    /// Remove password from response
    const usersWithoutPasswords = users.map((user) => {
        const {password, ...usersWithoutPasswords} = user;
        return usersWithoutPasswords;
    });

    return NextResponse.json({ users: usersWithoutPasswords });
} catch (error) {
    console.error("Admin user api error", error);
}



}