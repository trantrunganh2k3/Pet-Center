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

  const role = Cookies.get("role"); // Lấy role từ cookie
  console.log('Role in nav bar', role);
  
  const isAdmin = role === "ADMIN"; // Kiểm tra xem có phải admin không
  console.log('isAdmin', isAdmin);

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
    { label: "Nhân viên", href: "/admin/staff-manage" },
    { label: "Khách hàng", href: "/admin/cus-manage" },
    { label: "Thú cưng", href: "/admin/pet-manage" },
    { label: "Dịch vụ", href: "/admin/service-manage" },
  ];

  const navForAdmin = [
    { label: "Quản lý đặt lịch", href: "/admin/schedule-manage" },
  ];

  const navForStaff = [
    { label: "Lịch của tôi", href: "/admin/staff-schedule" },
  ];

  const navOverall = [
    ...navItems,
    ...(isAdmin ? navForAdmin : navForStaff),
  ]


  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm w-full fixed top-0 left-0 z-50 h-[72px]">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          {/* Logo can be replaced with an actual image or SVG */}
          <img src="/images/logo.jpg" alt="Logo" className="h-10" />
          <span className="text-orange-500">Pet House</span>
        </Link>
      </div>
      
      <nav className="flex-6">
        <ul className="flex justify-center space-x-8">
          {navOverall.map((item) => (
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
