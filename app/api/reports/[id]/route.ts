import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function GET(
    _req: NextRequest,{params}: {params: Promise< {id: string}>}
) {

    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const userId = (session.user as any).id;
        const {id: reportId} = await params;

        const report = await prisma.report.findFirst({
            where: {
                id: reportId ,
                OR: [{ userId }, {isPublic: true}],
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

    if (!report) {
        return NextResponse.json({error: "Report not found"}, {status: 404});
    }
    return NextResponse.json({report});
        
    } catch (error) {
        console.error("Get report error", error);
    }

}



export async function DELETE(
    _req: NextRequest,{params}: {params: Promise< {id: string}>}
) {

    try {

       const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const userId = (session.user as any).id;
        const {id: reportId} = await params;

        // Check ownership 
        const report = await prisma.report.findFirst({
            where: { id: reportId,userId},
        });

        if (!report) {
            return NextResponse.json(
                { error: "Report not found or unauthorized"},
                { status: 404}
            );
        }

        // Delete report 
        await prisma.report.delete({
            where: {id: reportId}
        })

        return NextResponse.json({ message: "Report deleted successfully"});
        
    } catch (error) {
        console.error("Delete report error", error);
    }

}