'use client';

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  // Mock data cho testimonials
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Dịch vụ rất tốt, nhân viên thân thiện và chuyên nghiệp. Thú cưng của tôi rất thích.",
      avatar: "/pet-login.jpg"
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 5,
      content: "Môi trường sạch sẽ, an toàn. Giá cả hợp lý. Sẽ quay lại nhiều lần nữa.",
      avatar: "/pet-login.jpg"
    },
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      content: "Đội ngũ bác sĩ rất giỏi và tận tâm. Cảm ơn đã chăm sóc tốt cho thú cưng của tôi.",
      avatar: "/pet-login.jpg"
    }
  ];

  const services = [
    {
      id: 1,
      title: "Grooming",
      description: "Dịch vụ tắm, cắt tỉa lông chuyên nghiệp cho thú cưng",
      icon: "🛁"
    },
    {
      id: 2,
      title: "Pet Hotel",
      description: "Dịch vụ trông giữ thú cưng với không gian thoải mái, an toàn",
      icon: "🏠"
    },
    {
      id: 3,
      title: "Veterinary",
      description: "Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ giàu kinh nghiệm",
      icon: "⚕️"
    },
    {
      id: 4,
      title: "Training",
      description: "Huấn luyện thú cưng với các chuyên gia hàng đầu",
      icon: "🎾"
    }
  ];

  const handleClick = () => {
    // Logic xử lý khi người dùng click vào nút "Đặt lịch ngay"
    console.log("Đặt lịch ngay được click");
    // Bạn có thể chuyển hướng đến trang đặt lịch hoặc mở modal
    if( Cookies.get("accessToken") ) {
      console.log("User is logged in, redirecting to schedule page");
      window.location.href = "/shedule";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-b from-[#4A90E2] via-[#4A90E2]/10 to-white">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 animate-fade-in">
            Chăm sóc tận tâm cho người bạn <br className="hidden md:block" />
            bốn chân của bạn
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chất lượng cao nhất cho thú cưng của bạn
          </p>
          <button 
            onClick={handleClick} 
            className="bg-[#FF6B2C] hover:bg-[#ff5a14] text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Đặt lịch ngay
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#4A90E2]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch vụ của chúng tôi</h2>
            <div className="w-24 h-1 bg-[#4A90E2] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-[#2563eb] group-hover:text-[#1d4ed8] font-semibold transform transition-all duration-300 group-hover:translate-x-2">
                  Tìm hiểu thêm →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/pet-login.jpg"
                alt="Pet Center"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Về chúng tôi</h2>
              <p className="text-gray-600 mb-6">
                Pet Center là trung tâm chăm sóc thú cưng hàng đầu, với sứ mệnh mang đến những dịch vụ 
                chất lượng cao nhất cho thú cưng của bạn. Chúng tôi hiểu rằng thú cưng là thành viên 
                quan trọng trong gia đình bạn.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-[#6FCF97] mr-2">✓</span>
                  Đội ngũ chuyên gia giàu kinh nghiệm
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-[#6FCF97] mr-2">✓</span>
                  Trang thiết bị hiện đại
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-[#6FCF97] mr-2">✓</span>
                  Dịch vụ chăm sóc 24/7
                </li>
              </ul>
              <Link 
                href="/introdution" 
                className="bg-[#4A90E2] hover:bg-[#357abd] text-white font-semibold px-6 py-3 rounded-lg inline-block"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-[#4A90E2]/5 via-[#6FCF97]/20 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <div className="w-24 h-1 bg-[#6FCF97] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="text-yellow-400">
                      {"★".repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF6B2C] to-[#FF8F6B] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Đặt lịch chăm sóc cho thú cưng của bạn
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Để thú cưng của bạn được chăm sóc tận tình bởi đội ngũ chuyên nghiệp của chúng tôi
          </p>
          <Link 
            href="/booking" 
            className="bg-white text-[#FF6B2C] font-semibold px-8 py-4 rounded-lg inline-block hover:bg-opacity-95 transition-all transform hover:scale-105 shadow-lg"
          >
            Đặt lịch ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
