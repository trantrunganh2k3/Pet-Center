package com.example.BE.service;

import com.example.BE.dto.response.BookingDetailsResponse;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.*;
import com.example.BE.enums.BookingDetailsStatus;
import com.example.BE.enums.BookingStatus;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.BookingDetailsMapper;
import com.example.BE.mapper.BookingMapper;
import com.example.BE.repository.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingDetailsService {

    BookingDetailsRepository bookingDetailsRepository;
    BookingDetailsMapper bookingDetailsMapper;
    BookingRepository bookingRepository;
    StaffRepository staffRepository;
    BookingMapper bookingMapper;

    public List<BookingDetailsResponse> getBookingDetailsForEach(String bookingId) {

        return bookingDetailsRepository.findByBookingBookingIdOrderByPriorityAsc(bookingId)
                .stream().map(bookingDetailsMapper::toBookingDetailsResponse).toList();
    }

    public List<BookingDetailsResponse> getBookingForStaff(String staffId) {

        return bookingDetailsRepository.findByStaffStaffId(staffId)
                .stream().map(bookingDetailsMapper::toBookingDetailsResponse).toList();
    }

    public BookingDetailsResponse updateBookingDetailsStatus(String bookingDetailsId, BookingDetailsStatus newStatus){

        BookingDetails bookingDetails = bookingDetailsRepository.findById(bookingDetailsId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_DETAIL_NOT_FOUND));

        validateStatusChange(bookingDetails, newStatus);
        bookingDetails.setStatus(newStatus);
        if(newStatus == BookingDetailsStatus.Completed){
            activateNextService(bookingDetails);
        }else {
            deactivateNextService(bookingDetails);
        }
        checkBookingCompletion(bookingDetails.getBooking().getBookingId());

        return bookingDetailsMapper.toBookingDetailsResponse(bookingDetailsRepository.save(bookingDetails));
    }

    public BookingResponse arrangeBookingDetails(String bookingId, List<BookingArrangement> bookingDetails){

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if(booking.getStatus() != BookingStatus.Confirmed){
            throw new AppException(ErrorCode.UPDATE_STATUS_DENY);
        }

        List<BookingDetails> bookingDetailsList = bookingDetailsRepository.findByBookingBookingId(bookingId);

        Map<String, BookingDetails> detailsMap = bookingDetailsList.stream()
                .collect(Collectors.toMap(BookingDetails::getBookingDetailsId, details -> details));

        System.out.println(detailsMap);

        for(int i=0; i<bookingDetails.size(); i++){

            BookingArrangement bookingArrangement = bookingDetails.get(i);
            System.out.println(bookingArrangement);
            BookingDetails detailToUpdate = detailsMap.get(bookingArrangement.getBookingDetailsId());

            if(detailToUpdate == null){
                throw new AppException(ErrorCode.BOOKING_DETAIL_NOT_FOUND);
            }

            Staff staff = staffRepository.findByStaffId(bookingArrangement.getStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

            detailToUpdate.setPriority(i+1);
            detailToUpdate.setStatus(i == 0 ? BookingDetailsStatus.Ready : BookingDetailsStatus.Pending);
            detailToUpdate.setStaff(staff);
            detailToUpdate.setBooking(booking);
            bookingDetailsRepository.save(detailToUpdate);
            booking.getBookingDetails().add(detailToUpdate);
        }

        booking.setStatus(BookingStatus.InProgress);

        return bookingMapper.toBookingResponse(bookingRepository.save(booking));
    }

    /**
     * Class đơn giản hóa chỉ chứa ID dịch vụ và ID nhân viên
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingArrangement {
        private String bookingDetailsId;   // ID của dịch vụ đã có trong hệ thống
        private String staffId;  // ID của nhân viên được phân công
    }


    private void validateStatusChange(BookingDetails bookingDetails, BookingDetailsStatus newStatus){

        if(newStatus == BookingDetailsStatus.InProgress && bookingDetails.getStatus() != BookingDetailsStatus.Ready){
            throw new AppException(ErrorCode.UPDATE_STATUS_DENY);
        }

        if(newStatus == BookingDetailsStatus.Completed && bookingDetails.getStatus() != BookingDetailsStatus.InProgress){
            throw new AppException(ErrorCode.UPDATE_STATUS_DENY);
        }

        if(bookingDetails.getPriority() > 1){

            List<BookingDetails> bookingDetailsList = bookingDetailsRepository
                    .findByBookingBookingId(bookingDetails.getBooking().getBookingId());

            Optional<BookingDetails> previousDetail = bookingDetailsList.stream()
                    .filter(os -> os.getPriority() == bookingDetails.getPriority() - 1)
                    .findFirst();

            if(previousDetail.isPresent() && previousDetail.get().getStatus() != BookingDetailsStatus.Completed){
                throw new AppException(ErrorCode.UPDATE_STATUS_DENY);
            }
        }
    }

    private void activateNextService(BookingDetails bookingDetails) {

        bookingDetailsRepository.
                 findFirstByBookingBookingIdAndPriorityGreaterThanOrderByPriorityAsc(
                        bookingDetails.getBooking().getBookingId(),
                        bookingDetails.getPriority()
                )
                .ifPresent(nextDetail -> {
                    nextDetail.setStatus(BookingDetailsStatus.Ready);
                    bookingDetailsRepository.save(nextDetail);
                });
    }

    private void deactivateNextService(BookingDetails bookingDetails) {

        bookingDetailsRepository.
                findFirstByBookingBookingIdAndPriorityGreaterThanOrderByPriorityAsc(
                        bookingDetails.getBooking().getBookingId(),
                        bookingDetails.getPriority()
                )
                .ifPresent(nextDetail -> {
                    nextDetail.setStatus(BookingDetailsStatus.Pending);
                    bookingDetailsRepository.save(nextDetail);
                });
    }

    private void checkBookingCompletion(String bookingId) {
        List<BookingDetails> bookingDetailsList = bookingDetailsRepository.findByBookingBookingId(bookingId);

        boolean allCompleted = bookingDetailsList.stream()
                .allMatch(os -> os.getStatus() == BookingDetailsStatus.Completed);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(allCompleted ? BookingStatus.Completed : BookingStatus.InProgress);
    }
}
