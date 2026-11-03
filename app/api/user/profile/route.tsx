import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest){
    try {

       const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
        where: { id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found"}, {status: 404});
    }

    return NextResponse.json({user });

    } catch (error) {
        console.error("Get profile error", error);
    }
}


export async function PUT(req: NextRequest) {
    try {

    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name } = body;

    // validation 
    if (!name || name.trim().length < 2) {
        return NextResponse.json(
            {error: "Name must be at least 2 characters long"},
            { status: 400 }
        );
    }

     if ( name.trim().length > 20) {
        return NextResponse.json(
            {error: "Name must be less than 50 characters"},
            { status: 400 }
        );
    }

    // UPdate user profile name 
    const updatedUser = await prisma.user.update({
        where: {id:userId},
        data: {
            name: name.trim(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true, 
        },
    });

    return NextResponse.json({
        message: "Profile updated successfully",
        user: updatedUser,
    });
        
    } catch (error) {
        console.error("Update profile error", error);
    }
}