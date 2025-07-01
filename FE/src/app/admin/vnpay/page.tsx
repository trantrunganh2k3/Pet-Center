'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const payment = searchParams.get('payment');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!payment) return;
    axios.get(`/api/payment/payment/${payment}`)
      .then(({ data }) => {
        if (data.result && data.result.paid) {
          setStatus('success');
        } else {
          setStatus('fail');
        }
      })
      .catch(() => setStatus('fail'));
  }, [payment]);

  const handleBackToSchedule = () => {
    router.push('/shedule');
  };

  const renderContent = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang xác nhận thanh toán...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          </div>
        );
      case 'fail':
        return (
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-600">Thanh toán không thành công hoặc chưa hoàn tất.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
        
        <div className="mt-8 space-y-3">
          <button 
            onClick={handleBackToSchedule}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay về trang đặt lịch
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
