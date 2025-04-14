import {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
import {serviceAPI} from '../app/APIRoute';
import {Service} from '../types/interfaces';
import { updateLocale } from 'moment';

interface ServerResponse<T = any> {
    code: number;
    message: string;
    result: T;
}

type ApiError = {
    response?: {
        data: ServerResponse;
        status: number;
        statusText: string;
    };
    message: string;
};

interface ServiceFormData {
    name: string;
    description: string;
    min_price: number;
    max_price: number;
    duration: number;
    categoryId?: string;
    imageUrl?: string;
}

// API services
const serviceAPIService = {
    async create(data: ServiceFormData, cateId: string): Promise<Service> {
        const response = await axios.post<ServerResponse<Service>>(
            `${serviceAPI}/${cateId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        if (response.data && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Lỗi khi thêm dịch vụ');
        }
        return response.data.result;
    },

    async getAllByCate(cateId: string): Promise<Service[]> {
        const response = await axios.get<ServerResponse<Service[]>>(
            `${serviceAPI}/${cateId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        if (response.data && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Error fetching services');
        }
        return response.data.result;
    },

    async update(id: string, data: Partial<ServiceFormData>): Promise<Service> {
        const response = await axios.put<ServerResponse<Service>>(
            `${serviceAPI}/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        if (response.data && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Lỗi khi cập nhật dịch vụ');
        }
        return response.data.result;
    },

    async delete(id: string): Promise<Service> {
        const response = await axios.delete<ServerResponse<Service>>(
            `${serviceAPI}/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        if (response.data && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Lỗi khi xóa dịch vụ');
        }
        return response.data.result;
    },
}

export function useServiceAPI() {

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async (cateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await serviceAPIService.getAllByCate(cateId);
            setServices(response);
        } catch (err) {
            handleError(err)
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error: unknown) => {
        const err = error as ApiError;
        const errorMessage = err.response?.data.message || err.message || 'Có lỗi xảy ra';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(errorMessage);
    };

    const updateService = async (cateId: string, id: string, data: Partial<ServiceFormData>) => {
        try {
            setLoading(true);
            setError(null);
            await serviceAPIService.update(id, data);
            await fetchServices(cateId); // Fetch updated list
            toast.success('Cập nhật dịch vụ thành công!');
            return true;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (cateId: string, id: string) => {
        try {
            setLoading(true);
            setError(null);
            await serviceAPIService.delete(id);
            await fetchServices(cateId); // Fetch updated list
            toast.success('Xóa dịch vụ thành công!');
            return true;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const createService = async (cateId: string, data: ServiceFormData) => {
        try {
            setLoading(true);
            setError(null);
            await serviceAPIService.create(data, cateId);
            await fetchServices(cateId); // Fetch updated list
            toast.success('Thêm dịch vụ thành công!');
            return true;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        services,
        loading,
        error,
        fetchServices,
        updateService,
        deleteService,
        createService,
    };
}