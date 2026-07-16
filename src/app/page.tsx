import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import HomeWrapper from "./HomeWrapper";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  let userProfile = null;
  let urgentTask = null;

  if (session?.user?.id) {
    const prisma = getPrisma();
    
    // Fetch user basic info
    userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        karma: true,
      }
    });

    // Fetch most urgent incomplete task
    const tasks = await prisma.task.findMany({
      where: { 
        userId: session.user.id,
        isCompleted: false,
      },
      orderBy: { dueDate: 'asc' },
      take: 1
    });

    if (tasks.length > 0) {
      urgentTask = tasks[0];
    }
  }

  return <HomeWrapper userProfile={userProfile} urgentTask={urgentTask} />;
}
