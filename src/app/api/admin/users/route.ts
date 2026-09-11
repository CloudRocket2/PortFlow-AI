import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "GOV-AUTH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: {
      role: { not: "GOV-AUTH" }
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      department: true,
      clearance: true,
      isSetupComplete: true,
      setupCode: true,
      createdAt: true
    }
  });

  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "GOV-AUTH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, name, role, department, clearance } = body;

    // Generate a secure 6-digit access code
    const setupCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        department,
        clearance,
        password_hash: "PENDING_SETUP",
        setupCode,
        isSetupComplete: false,
      }
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to provision user" }, { status: 500 });
  }
}
