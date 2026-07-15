import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = getPrisma();
    const items = await prisma.shopItem.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
