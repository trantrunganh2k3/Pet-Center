export interface Booking {
    id: number;
    customerId: number; 
    bookingDate: string;
    totalPrice: number;
    status: string;
    note: string;
}

export interface BookingDetail {
    id: number;
    bookingId: number;
    serviceId: number;
    serviceName: string;
    petId: number;
    petName: string;
    price: number;
    status: string;
}
