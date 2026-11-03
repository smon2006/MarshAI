import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const PREFIX = "password-reset:";

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const record = await prisma.verificationToken.findUnique({
      where: { token: tokenHash },
    });

    if (!record || !record.identifier.startsWith(PREFIX)) {
      return NextResponse.json(
        { error: "This reset link is invalid or has already been used" },
        { status: 400 }
      );
    }

    if (record.expires.getTime() < Date.now()) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: record.identifier },
      });
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one" },
        { status: 400 }
      );
    }

    const email = record.identifier.slice(PREFIX.length);
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { email }, data: { password: hashedPassword } }),
      // One use only
      prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } }),
    ]);

    return NextResponse.json({ message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again" }, { status: 500 });
  }
}