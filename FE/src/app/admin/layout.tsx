"use client";
import AdminHeader from "@/components/AdminHeader";
import { QueryProvider } from "./providers/QueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header UI */}
        <AdminHeader />
        {/* Main content với padding-top */}
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
