import { BookingDetailsStatus, BookingStatus } from "@/app/types/booking";
import dayjs from "dayjs";

export interface Booking {
    bookingId: string;
    customerId: number; 
    createdDate: string;
    total?: number;
    status: BookingStatus;
    note?: string;
    rating?: number;
    comment?: string;
}

export interface BookingDetail {
    bookingDetailsid: string;
    bookingId: string;
    pet: PetInfo;
    service: ServiceInfo;
    price: number;
    status: BookingDetailsStatus;
    selectedDate: string;
}

interface PetInfo {
    petId: string;
    petName: string;
}

interface ServiceInfo{
    serviceId: string;
    serviceName: string;
}
