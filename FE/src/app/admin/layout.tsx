"use client";
import AdminHeader from "@/components/AdminHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      {/* Header UI */}
      <AdminHeader />
      {/* Main content với padding-top */}
      <main className="flex-1 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
