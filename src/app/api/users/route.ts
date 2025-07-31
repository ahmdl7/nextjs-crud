// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// app/api/users/route.ts
export async function POST(request: Request) {
  const { name, email } = await request.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({ data: { name, email } });
    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      // P2002 = unique constraint failed
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
