import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";

// Simple in-memory rate limiter (prototype only)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limit
    const now = Date.now();
    // Rate limit check temporarily disabled
    /*
    const rateLimit = rateLimitMap.get(ip);
    if (rateLimit && now < rateLimit.resetAt) {
      if (rateLimit.count >= 5) {
        // Delay response to slow down brute force
        await new Promise(resolve => setTimeout(resolve, 2000));
        return NextResponse.json(
          { success: false, message: "Too many login attempts. Please try again later." },
          { status: 429 }
        );
      }
    }
    */

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generic error message for both cases
    const invalidCredentialsResponse = NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );

    // Helper function to record failure
    const recordFailure = async () => {
      const current = rateLimitMap.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 }; // 15 mins block
      rateLimitMap.set(ip, { count: current.count + 1, resetAt: current.resetAt });
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Simulate bcrypt timing to prevent timing attacks
      await bcrypt.hash(password, 10);
      await recordFailure();
      return invalidCredentialsResponse;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      await recordFailure();
      return invalidCredentialsResponse;
    }

    // Reset rate limit on success
    rateLimitMap.delete(ip);

    // Create JWT
    const token = await createSessionToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name,
      clearance: user.clearance
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clearance: user.clearance
      }
    });

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: "portflow_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
