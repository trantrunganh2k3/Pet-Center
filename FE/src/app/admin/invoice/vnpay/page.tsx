import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentResult() {
  const router = useRouter();
  const { payment } = router.query;
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!payment) return;
    // Gọi BE để kiểm tra trạng thái thanh toán
    axios.get(`/api/payment/payment/${payment}`)
      .then(({data}) => {
        if (data.result && data.result.paid) {
          setStatus('success');
        } else {
          setStatus('fail');
        }
      })
      .catch(() => setStatus('fail'));
  }, [payment]);

  if (status === 'pending') return <p>Đang xác nhận thanh toán...</p>;
  if (status === 'success') return <h2>Thanh toán thành công! 🎉</h2>;
  return <h2>Thanh toán thất bại hoặc chưa hoàn tất.</h2>;
}
