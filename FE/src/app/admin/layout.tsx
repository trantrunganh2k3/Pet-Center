// app/admin/layout.tsx
import AdminHeader from "@/components/AdminHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header UI */}
      <AdminHeader />
      {/* Main content với padding-top */}
      <main className="flex-1 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
