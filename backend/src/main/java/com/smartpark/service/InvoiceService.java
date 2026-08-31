package com.smartpark.service;

import com.smartpark.dto.response.InvoiceResponse;
import com.smartpark.entity.Booking;
import com.smartpark.entity.Invoice;

public interface InvoiceService {
    Invoice generateInvoice(Booking booking);
    InvoiceResponse getInvoiceById(Long invoiceId);
    InvoiceResponse getInvoiceByBookingId(Long bookingId);
    byte[] getInvoicePdf(Long invoiceId);
}
