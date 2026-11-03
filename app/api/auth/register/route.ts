import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role, PlanType } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name } = body;
        //console.log(body);

        // Validate input 
        if (!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            );
        }

        /// Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if (existingUser) {
             return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            );
        }

        /// Hash password 
        const hashedPassword = await bcrypt.hash(password,12);

        // Create user with Free Subscription 

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null,
            role: Role.USER,
            image: "/default-avatar.png",
            subscription: {
                create: {
                    planType: PlanType.FREE,
                    isActive: true,
                }, 
            },
            usage: {
                create: {
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                    validationCount: 0,
                },
            },
        },
        include: {
            subscription: true
        },
    });

    // Remove password from resposne 
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
        {
            message: "User created successfully",
            user: userWithoutPassword,
        },
        { status: 201 }
    );
    } catch (error) {
        console.error("Register error:", error);
    }
}