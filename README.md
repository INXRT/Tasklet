<div align="center">
  <img src="public/pokequest.png" alt="PokéQuest Logo" width="300" />
  
  # PokéQuest
  
  **Gamify your productivity.** Complete real-life tasks, earn coins and XP, collect Pokémon companions, and maintain your streak. But beware—miss your tasks and you'll break your streak and upset your companions!
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🎮 Features

### 📅 The Dashboard
Manage your daily, weekly, and monthly tasks in a sleek, liquid glass UI. Switch seamlessly between the beautiful List view and the interactive Monthly Calendar view to plan your life.



### ✅ Task Management & Punishments
Create detailed tasks with durations and recurrence rules. 
- **Reward:** Completing a task grants you Coins and XP to level up your Pokémon!
- **Punishment:** Miss a task, and your streak resets to 0 while your active Pokémon becomes sad. The UI will distinctly highlight your failures so you stay accountable.

### 🐾 Pokémon Roster & Inventory
Unlock new Pokémon companions and switch between them! Spend your hard-earned task coins in the Shop to buy Food and items, then use them from your Inventory to keep your Pokémon happy.


---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** PostgreSQL managed via [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom Skeuomorphic & Glassmorphic utilities
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** NextAuth.js (Google Provider)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Local or hosted like Supabase/Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pokequest.git
   cd pokequest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pokequest"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your database and generate the client.
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the app!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/pokequest/issues).
