// import { useState, useEffect } from 'react';
// import axios, { create } from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import { petAPI } from '../app/APIRoute';

// // Services (các hàm gọi API)
// const petAPTService = {
//     async create(data, id) {
//         const response = await axios.post(
//             `${petAPI}/${id}`,
//             data
//         );
//         if (response.data && response.data.code !== 1000) {
//             throw new Error(response.data.message || 'Lỗi khi tạo khách hàng');
//           }
//           return response.data.result;
//     },

//     async getAll() {
//         const response = await axios.get(
//           petAPI, {
//             headers: {
//               Authorization: `Bearer ${Cookies.get('accessToken')}`,
//             },
//           },
//         );
//         if (response.data && response.data.code !== 1000) {
//           throw new Error(response.data.message || 'Lỗi khi lấy danh sách khách hàng');
//         }
//         return response.data.result;
//     },

//     async update(id, data) {
//         const response = await axios.put(
//           `${petAPI}/${id}`,
//           data, {
//             headers: {
//               Authorization: `Bearer ${Cookies.get('accessToken')}`,
//             },
//           },
//         );
//         if (response.data && response.data.code !== 1000) {
//           throw new Error(response.data.message || 'Lỗi khi cập nhật thông tin');
//         }
//         return response.data.result;
//     },

//     async delete(id) {
//         const response = await axios.delete(
//           `${customersAPI}/${id}`, {
//             headers: {
//               Authorization: `Bearer ${Cookies.get('accessToken')}`,
//             },
//           },
//         );
//         if (response.data && response.data.code !== 1000) {
//           throw new Error(response.data.message || 'Lỗi khi xóa khách hàng');
//         }
//         return response.data.result;
//       }
// }

// // Custom hook sử dụng services ở trên
// export function useCustomers() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       setError(null); // Reset error trước khi fetch
//       const data = await customerAPIService.getAll();
//       setCustomers(data);
//     } catch (err) {
//       handleError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý lỗi chung
//   const handleError = (err) => {
//     if (err.response && err.response.data) {
//       // Lỗi từ API response
//       setError(err.response.data.message || 'Có lỗi xảy ra từ server');
//       toast.error(err.response.data.message || 'Có lỗi xảy ra từ server');
//     } else {
//       // Lỗi khác (network, timeout...)
//       setError(err.message || 'Có lỗi xảy ra');
//       toast.error(err.message || 'Có lỗi xảy ra');
//     }
//     console.error('API Error:', err);
//   };

//   const updateCustomer = async (id, data) => {
//     try {
//       setLoading(true);
//       setError(null); // Reset error
//       await customerAPIService.update(id, data);
//       await fetchCustomers(); // Refresh sau khi cập nhật
//       toast.success('Cập nhật thông tin thành công!');
//       return true;
//     } catch (err) {
//       handleError(err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCustomer = async (id) => {
//     try {
//       setLoading(true);
//       setError(null); // Reset error
//       await customerAPIService.delete(id);
//       await fetchCustomers(); // Refresh sau khi xóa
//       toast.success('Xóa thông tin thành công!');
//       return true;
//     } catch (err) {
//       handleError(err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createCustomer = async (data) => {
//     try {
//       setLoading(true);
//       setError(null); // Reset error
//       await customerAPIService.create(data);
//       await fetchCustomers(); // Refresh sau khi tạo mới
//       toast.success('Tạo khách hàng mới thành công!');
//       return true;
//     } catch (err) {
//       handleError(err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tự động tải khi component mount
//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   return {
//     customers,
//     loading,
//     error,
//     fetchCustomers,
//     updateCustomer,
//     deleteCustomer,
//     createCustomer
//   };
// }