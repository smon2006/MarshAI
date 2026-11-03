import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role, } from "@prisma/client";

export async function PATCH(req: NextRequest,
    {params}: {params: Promise<{ id: string }>}
) {

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

    const {id} = await params;
    const body = await req.json();
    const { action,rejectedReason } = body;

    if (!action || !["approve", "reject"].includes(action)) {
        return NextResponse.json(
            {error: "Invalid actions. Must be 'approve' or 'reject' "},
            {status: 400}
        );
    }

    if (action === "reject" && !rejectedReason) {
        return NextResponse.json(
            {error: "Rejection reason is required "},
            {status: 400}
        );
    }

    const paymentRequest = await prisma.paymentRequest.findUnique({
        where: {id},
    });

    if (!paymentRequest) {
        return NextResponse.json(
            {error: "Payment request is not found "},
            {status: 404}
        );
    }

    if (paymentRequest.status !== "PENDING") {
         return NextResponse.json(
            {error: "Payment request already processed "},
            {status: 400}
        );
    }


    if (action === "approve") {
        // Update payment request status 
        await prisma.paymentRequest.update({
            where:{ id },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });

    // Upgrade user to pro user
    const oneYearFormNow = new Date();
    oneYearFormNow.setFullYear(oneYearFormNow.getFullYear() + 1);

    const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: paymentRequest.userId},
    });

    if (existingSubscription) {
        await prisma.subscription.update({
            where: { userId: paymentRequest.userId},
            data: {
                planType: "PRO",
                isActive: true,
                startDate: new Date(),
                endDate: oneYearFormNow,
            },
        });
    } else {
        await prisma.subscription.create({
            data: {
                userId: paymentRequest.userId,
                planType: "PRO",
                isActive: true,
                startDate: new Date(),
                endDate: oneYearFormNow,
            },
        });
    }
    return NextResponse.json({
        message: "Payment approved and user upgraded to Pro",
    });        
  } else {
    /// Reject payment request 
    await prisma.paymentRequest.update({
        where: {id},
        data: {
            status: "REJECTED",
            rejectedReason,
        },
    });

    return NextResponse.json({
        message: "Payment request rejected",
    });

  }
 } catch (error) {
    console.error("Update payment request error", error);
 } 

}