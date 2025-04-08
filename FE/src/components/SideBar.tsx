// components/Header.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("token");
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
    window.addEventListener('focus', checkAuthStatus);
    return () => {
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, [pathname]);
  
  const navItems = [
    { label: "Tài khoản", href: "/my-account" },
    { label: "Thú cưng của tôi", href: "/my-pet" },
    { label: "Lịch sử đặt lịch", href: "/history" },
  ];

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm w-full fixed top-0 left-0 p-4 z-50">
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