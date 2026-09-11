import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, setupCode, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (user.isSetupComplete) {
      return NextResponse.json({ error: "Setup is already complete for this account" }, { status: 400 });
    }

    if (user.setupCode !== setupCode) {
      return NextResponse.json({ error: "Invalid setup code" }, { status: 400 });
    }

    // Hash the new custom password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        password_hash: hashedPassword,
        isSetupComplete: true,
        setupCode: null // Consume the code
      }
    });

    // Automatically log them in
    const token = await createSessionToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({ success: true, redirect: "/" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to complete setup" }, { status: 500 });
  }
}
