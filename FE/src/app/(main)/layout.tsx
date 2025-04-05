// app/admin/layout.tsx
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header UI */}
      <Header />
      {/* Main content với padding-top */}
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}