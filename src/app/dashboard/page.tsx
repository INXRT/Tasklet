import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    include: {
      tasks: {
        orderBy: { dueDate: "asc" }
      }
    }
  });
  
  if (!user || !user.selectedCompanion) {
    redirect("/onboarding");
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 z-10 relative">
      <DashboardClient user={user} />
    </div>
  );
}
