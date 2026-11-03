import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role, } from "@prisma/client";

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

    /// Get data from payment request table 
    const paymentRequests = await prisma.paymentRequest.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {createdAt: "desc"},
    });

    return NextResponse.json({ paymentRequests });
    } catch (error) {
        console.error("Get payment request error", error);
    }

}