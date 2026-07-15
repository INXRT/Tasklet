"use server";

import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function selectCompanion(companionType: string) {
  try {
    const prisma = getPrisma();
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          selectedCompanion: companionType,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { selectedCompanion: companionType },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
