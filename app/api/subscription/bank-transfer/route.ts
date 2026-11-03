import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formData = await req.formData();
    const file = formData.get("invoice") as File;
    const transactionId = formData.get("transactionId") as string;

    if (!file) {
      return NextResponse.json({ error: "Invoice file is required" }, { status: 400 });
    }

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    const fileExt = file.name.toLowerCase().split(".").pop();
    const allowedExtensions = ["jpeg", "jpg", "png", "webp", "pdf"];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt || "")) {
      return NextResponse.json(
        { error: `Only jpg, png, webp and pdf files are allowed. Received ${file.type}` },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `invoice_${userId}_${timestamp}.${fileExtension}`;

    let invoicePath: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Live site: store the file in Vercel Blob
      const blob = await put(`invoices/${fileName}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      invoicePath = blob.url;
    } else {
      // Local development: save to disk like before
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "invoices");
      await mkdir(uploadsDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadsDir, fileName), buffer);
      invoicePath = `/uploads/invoices/${fileName}`;
    }

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId,
        transactionId: transactionId.trim(),
        invoicePath,
        status: "PENDING",
        payment: "₹2500",
      },
    });

    return NextResponse.json({
      message: "Payment request submitted successfully. Awaiting admin approval",
      paymentRequest: {
        id: paymentRequest.id,
        status: paymentRequest.status,
        createdAt: paymentRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Bank transfer error", error);
    return NextResponse.json({ error: "Failed to submit payment request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const paymentRequests = await prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        transactionId: true,
        status: true,
        approvedAt: true,
        rejectedReason: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ paymentRequests });
  } catch (error) {
    console.error("Get payment requests error", error);
    return NextResponse.json({ error: "Failed to load payment requests" }, { status: 500 });
  }
}