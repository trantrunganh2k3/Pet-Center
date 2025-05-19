// app/(main)/tai-khoan/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsAuthenticated(!!token);
    
    // Nếu không có token, chuyển hướng về trang đăng nhập
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // Danh sách các mục trong sidebar
  const sidebarItems = [
    { 
      label: "Thông tin tài khoản", 
      href: "/my-account",
      // Đường dẫn chính xác sẽ trùng khớp
      active: pathname === "/my-account" 
    },
    { 
      label: "Thú cưng của tôi", 
      href: "/my-account/my-pet",
      // Đường dẫn /tai-khoan/thu-cung và bất kỳ đường dẫn con của nó
      active: pathname.startsWith("/my-account/my-pet") 
    },
    { 
      label: "Lịch sử dịch vụ", 
      href: "/my-account/history",
      // Đường dẫn /tai-khoan/lich-su và bất kỳ đường dẫn con của nó
      active: pathname.startsWith("/my-account/history") 
    },
  ];

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Đang kiểm tra thông tin đăng nhập...</div>;
  }

  return (
    <div className="w-full mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Quản lý tài khoản</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="p-4">
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-md transition-colors ${
                        item.active
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
