'use client';

import { Modal } from 'antd';
import Rate from 'antd/es/rate';
import { useState } from 'react';
import { Booking } from '../types';
import { toast } from 'react-toastify';
import axios from 'axios';
import { bookingAPI } from '@/app/APIRoute';
import Cookies from 'js-cookie';

interface RatingModalProps {
    booking: Booking;
    visible: boolean;
    onClose: () => void;
}

export default function RatingModal({ booking, visible, onClose }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!rating) {
            toast.error('Vui lòng chọn đánh giá');
            return;
        }
        if (!comment.trim()) {
            toast.error('Vui lòng nhập nhận xét');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.put<{code: number, message?: string, result?: any}>(
                `${bookingAPI}/evaluate/${booking.bookingId}`, 
                {
                    rating,
                    comment,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                    withCredentials: true,
                }
            );
            if (response.data.code !== 1000) {
                toast.error(response.data.message || 'Failed to submit rating');
                return;
            }
            toast.success('Đánh giá đã được gửi thành công');
            // Reset the form
            setRating(0);
            setComment('');
            onClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Đã xảy ra lỗi khi gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Đánh giá dịch vụ"
            open={visible}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Gửi đánh giá"
            cancelText="Hủy"
            confirmLoading={submitting}
        >
            <div className="space-y-4">
                <div>
                    <label className="block mb-2">Đánh giá của bạn</label>
                    <Rate value={rating} onChange={setRating} />
                </div>
                <div>
                    <label className="block mb-2">Nhận xét</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded"
                        placeholder="Nhập nhận xét của bạn về dịch vụ..."
                    />
                </div>
            </div>
        </Modal>
    );
}
