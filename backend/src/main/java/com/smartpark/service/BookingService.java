package com.smartpark.service;

import com.smartpark.dto.request.BookingRequest;
import com.smartpark.dto.request.CheckInRequest;
import com.smartpark.dto.request.CheckOutRequest;
import com.smartpark.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(Long userId, BookingRequest request);
    BookingResponse getBookingById(Long bookingId, Long userId);
    BookingResponse getBookingByNumber(String bookingNumber);
    List<BookingResponse> getUserBookings(Long userId);
    List<BookingResponse> getBookingsByLocation(Long locationId);
    List<BookingResponse> getAllBookings();
    BookingResponse cancelBooking(Long bookingId, Long userId);

    // Parking Operations
    BookingResponse checkIn(CheckInRequest request, Long adminId);
    BookingResponse checkOut(CheckOutRequest request, Long adminId);
}
