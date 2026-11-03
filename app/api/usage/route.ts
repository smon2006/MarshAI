import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PlanType } from "@prisma/client";

export async function GET(req: NextRequest) {
    try {
        
    const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const userId = (session.user as any).id;

    /// Get User with subscription 
    const user = await prisma.user.findUnique({
        where: { id:userId },
        include: { subscription: true}
    });

    if (!user || !user.subscription) {
        return NextResponse.json(
            {error: "User or subscripton not found"},
            {status: 404}
        );
    }

    const isPro = user.subscription.planType === PlanType.PRO;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    /// Get current months useage 
    const usage = await prisma.usageLog.findUnique({
        where: {
            userId_month_year: {
                userId,
                month: currentMonth,
                year: currentYear
            },
        },
    });

    const used = usage?.validationCount || 0;
    const limit = 3; // Free plan limit 
    const percentage = isPro ? 0 : Math.round((used / limit) * 100);

    return NextResponse.json({
        used,
        limit,
        percentage,
        isPro,
        planType: user.subscription.planType,
    });
    } catch (error) {
        console.error("Usage api error", error);
    }
}
