import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma"; 

export async function POST(req: NextRequest){

try {

    const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Check if user has a subscription
        const subscription = await prisma.subscription.findUnique({
            where: {userId},
        });

        if (!subscription) {
            return NextResponse.json(
                {error: "No subscription found"},
                {status: 404}
            );
        }

        if (subscription.planType === "FREE") {
            return NextResponse.json(
                {error: "You are already on the Free plan"},
                {status: 400}
            );
        }

        /// Downgrade to Free Plan 
        const updatedSubscription = await prisma.subscription.update({
            where: {userId},
            data: {
                planType: "FREE",
                isActive: true,
                endDate: null,
            },
        });

        return NextResponse.json({
            message: "Successfully downgraded to Free Plan",
            subscription: {
                planType: updatedSubscription.planType,
                startDate: updatedSubscription.startDate,
                isActive: updatedSubscription.isActive,
            },
        });
} catch (error) {
    console.error("Subscription cancel error");
}
}