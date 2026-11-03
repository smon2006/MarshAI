import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role, PlanType, ReportStatus } from "@prisma/client";
 
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

        // Get Total users 
        const totalUsers = await prisma.user.count();

        // Get Users by plan
        const subscriptions = await prisma.subscription.groupBy({
            by: ["planType"],
            _count: true,
        });

const planBreakdown = {
    FREE: subscriptions.find((s) => s.planType === PlanType.FREE)?._count || 0,
    PRO: subscriptions.find((s) => s.planType === PlanType.PRO)?._count || 0,
};

    // Get total reports 
    const totalReports = await prisma.report.count();

    // Get reports by status 
    const reportsByStatus = await prisma.report.groupBy({
        by: ["status"],
        _count: true,
    })

    const reportsBreakdown = {
        COMPLETED: reportsByStatus.find((r) => r.status === ReportStatus.COMPLETED)?._count || 0,
        PROCESSING: reportsByStatus.find((r) => r.status === ReportStatus.PROCESSING)?._count || 0,
        PENDING: reportsByStatus.find((r) => r.status === ReportStatus.PENDING)?._count || 0,
        FAILED: reportsByStatus.find((r) => r.status === ReportStatus.FAILED)?._count || 0,
    };

    /// Get current month usage
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyUsage = await prisma.usageLog.aggregate({
        where: {
            month: currentMonth,
            year: currentYear,
        },
        _sum: {
            validationCount: true,
        },
    });

    // Get new user this month
    const firstDateOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const newUsersThisMonth = await prisma.user.count({
        where: {
            createdAt: {
                gte: firstDateOfMonth,
            },
        },
    });

    // Get Recent activity fro last 7 days 
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await prisma.report.count({
        where: {
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
    });


    /// Get average score of completed reports 
    const avgScore = await prisma.report.aggregate({
        where: {
            status: ReportStatus.COMPLETED,
            overallScore: {
                not: null,
            },
        },
        _avg: {
            overallScore: true,
        },
    });

    // Get total MRR from approved payment requests
const approvedPayments = await prisma.paymentRequest.findMany({
    where: { status: "APPROVED" },
    select: { payment: true },
});

const totalMRR = approvedPayments.reduce((sum, p) => {
    const amount = parseFloat((p.payment || "₹0").replace("₹", ""));
    return sum + (isNaN(amount) ? 0 : amount);
}, 0);



    return NextResponse.json({
        totalUsers,
        planBreakdown,
        totalReports,
        reportsBreakdown,
        monthlyValidations: monthlyUsage._sum.validationCount || 0,
        newUsersThisMonth,
        recentReports,
        averageScore: avgScore._avg.overallScore
            ? Math.round(avgScore._avg.overallScore)
            : 0,
        totalMRR, 

    });
    } catch (error) {
        console.error("Admin analytics api error", error);''
    }

}