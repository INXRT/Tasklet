"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function selectCompanion(companionType: string) {
  // For the hackathon, we'll create a single "dummy" user session
  // In a real app, this would use NextAuth or Clerk
  
  // Try to find the existing demo user, or create one
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

  // Redirect to the main dashboard after selection
  redirect("/dashboard");
}
