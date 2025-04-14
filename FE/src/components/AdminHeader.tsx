// components/Header.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("accessToken"); // Hoặc tên cookie bạn đang sử dụng
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
    window.addEventListener('focus', checkAuthStatus);
    return () => {
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, [pathname]);

  const navItems = [
    { label: "Thống kê", href: "/admin" },
    { label: "Quản lý đặt lịch", href: "/admin/schedule-manage" },
    { label: "Quản lý nhân viên", href: "/admin/staff-manage" },
    { label: "Quản lý khách hàng", href: "/admin/cus-manage" },
    { label: "Quản lý thú cưng", href: "/admin/pet-manage" },
    { label: "Quản lý dịch vụ", href: "/admin/service-manage" },
  ];

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm w-full fixed top-0 left-0 z-50 h-[72px]">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold">Logo</Link>
      </div>
      
      <nav className="flex-2">
        <ul className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`pb-1 ${
                  pathname === item.href 
                    ? "border-b-2 border-blue-500 font-medium" 
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="flex-1 flex justify-end">
        <AuthButtons />
      </div>
    </header>
  );
}
