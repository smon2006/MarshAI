import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";


export async function PATCH(req: NextRequest, 
    {params} : { params: Promise< {id: string}>} ) {
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


        const { id: userId } = await params;
        const body = await req.json();
        const { role, planType, isActive } = body;

        // Update user role if provided 
        if (role) {
            await prisma.user.update({
                where: { id: userId},
                data: {role},
            });
        }

        /// Update subscription if provided 
        if (planType !== undefined || isActive !== undefined) {
            await prisma.subscription.updateMany({
                where: {userId},
                data: {
                    ...(planType && {planType}),
                    ...(isActive !== undefined && {isActive}),
                },
            });
        }

    // Fetch updated user data 
    const updatedUser = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            subscription: true
        },
    });

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found"}, {status: 404});
    }

    return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser
    });        
    } catch (error) {
        console.error("Admin update user error");
    }
}



export async function DELETE( req: NextRequest, 
    {params}: { params: Promise<{id: string}> }
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

        const { id: userId } = await params;

        /// don't allow admin to delete themselves 
        if (userId === (session.user as any).id) {
            return NextResponse.json(
                {error: "Cannot dlete your own account"},
                { status: 400 }
            );
        }

        // Delete user 
        await prisma.user.delete({
            where: {id: userId},
        });
    return NextResponse.json({ message: "User deleted successfully"});

    } catch (error) {
        console.error("Admin user delete errro", error);
    }
}