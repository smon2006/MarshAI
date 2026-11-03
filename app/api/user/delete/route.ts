import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import path from "path";
import { unlink } from "fs/promises";
import { del } from "@vercel/blob";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required to delete your account" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        role: true,
        paymentRequests: { select: { invoicePath: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted from here" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id: userId } });

        await Promise.allSettled(
      user.paymentRequests.map((p) =>
        p.invoicePath.startsWith("http")
          ? del(p.invoicePath)
          : unlink(path.join(process.cwd(), "public", p.invoicePath))
      )
    );

    return NextResponse.json({ message: "Your account has been deleted" });
  } catch (error) {
    console.error("Delete account error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again" },
      { status: 500 }
    );
  }
}