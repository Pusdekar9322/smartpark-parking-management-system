package com.smartpark.util;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.smartpark.entity.Invoice;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class PdfInvoiceGenerator {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a");

    public byte[] generateInvoicePdf(Invoice invoice) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(79, 70, 229); // Brand Indigo
            Color secondaryColor = new Color(71, 85, 105); // Slate
            Color lightBg = new Color(248, 250, 252);

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, secondaryColor);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, primaryColor);

            // Header Section
            Paragraph brandTitle = new Paragraph("SMARTPARK 🇮🇳", titleFont);
            brandTitle.setAlignment(Element.ALIGN_LEFT);
            document.add(brandTitle);

            Paragraph brandSubtitle = new Paragraph("Smart Parking Reservation, Payment & Management Platform", subtitleFont);
            document.add(brandSubtitle);

            document.add(new Paragraph(" "));
            LineSeparator ls = new LineSeparator();
            ls.setLineColor(new Color(226, 232, 240));
            document.add(ls);
            document.add(new Paragraph(" "));

            // Invoice Summary Meta Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{1, 1});

            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("INVOICE TO:", headerFont));
            leftCell.addElement(new Paragraph(invoice.getCustomerName(), boldFont));
            leftCell.addElement(new Paragraph("Mobile: " + invoice.getCustomerMobile(), normalFont));
            leftCell.addElement(new Paragraph("Vehicle: " + invoice.getVehicleNumber() + " (" + invoice.getVehicleType() + ")", normalFont));

            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(new Paragraph("INVOICE DETAILS", headerFont));
            rightCell.addElement(new Paragraph("Invoice No: " + invoice.getInvoiceNumber(), boldFont));
            rightCell.addElement(new Paragraph("Booking Ref: " + invoice.getBooking().getBookingNumber(), normalFont));
            rightCell.addElement(new Paragraph("Date: " + invoice.getGeneratedAt().format(DATE_TIME_FORMATTER), normalFont));
            rightCell.addElement(new Paragraph("Status: " + invoice.getPaymentStatus().name(), boldFont));

            metaTable.addCell(leftCell);
            metaTable.addCell(rightCell);
            document.add(metaTable);

            document.add(new Paragraph(" "));

            // Parking Location Details Box
            PdfPTable locTable = new PdfPTable(1);
            locTable.setWidthPercentage(100);
            PdfPCell locCell = new PdfPCell();
            locCell.setBackgroundColor(lightBg);
            locCell.setPadding(10);
            locCell.setBorderColor(new Color(226, 232, 240));

            Paragraph locTitle = new Paragraph("Parking Facility: " + invoice.getLocationName(), boldFont);
            Paragraph locAddress = new Paragraph("Address: " + invoice.getLocationAddress() + " | Floor: " + invoice.getFloorName() + " | Slot: " + invoice.getSlotNumber(), normalFont);
            locCell.addElement(locTitle);
            locCell.addElement(locAddress);
            locTable.addCell(locCell);
            document.add(locTable);

            document.add(new Paragraph(" "));

            // Parking Charges Table
            PdfPTable itemsTable = new PdfPTable(4);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{3.5f, 2f, 2f, 2.5f});

            // Table Header
            String[] headers = {"Description", "Entry Time", "Exit Time", "Amount (INR)"};
            for (String h : headers) {
                PdfPCell header = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE)));
                header.setBackgroundColor(primaryColor);
                header.setPadding(6);
                header.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(header);
            }

            // Table Row
            PdfPCell descCell = new PdfPCell(new Phrase("Parking Session (" + invoice.getDurationHours() + " hrs)", normalFont));
            descCell.setPadding(6);
            itemsTable.addCell(descCell);

            PdfPCell entryCell = new PdfPCell(new Phrase(invoice.getEntryTime().format(DATE_TIME_FORMATTER), normalFont));
            entryCell.setPadding(6);
            entryCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            itemsTable.addCell(entryCell);

            PdfPCell exitCell = new PdfPCell(new Phrase(invoice.getExitTime().format(DATE_TIME_FORMATTER), normalFont));
            exitCell.setPadding(6);
            exitCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            itemsTable.addCell(exitCell);

            PdfPCell amountCell = new PdfPCell(new Phrase("₹" + invoice.getParkingCharges(), normalFont));
            amountCell.setPadding(6);
            amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            itemsTable.addCell(amountCell);

            document.add(itemsTable);

            // Calculation Breakdown Table
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(50);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.setWidths(new float[]{2, 2});

            addCalculationRow(totalTable, "Parking Charges:", "₹" + invoice.getParkingCharges(), normalFont, normalFont);

            if (invoice.getDiscountAmount() != null && invoice.getDiscountAmount().doubleValue() > 0) {
                addCalculationRow(totalTable, "Coupon Discount:", "- ₹" + invoice.getDiscountAmount(), normalFont, normalFont);
            }

            if (invoice.getCgstAmount() != null && invoice.getCgstAmount().doubleValue() > 0) {
                addCalculationRow(totalTable, "CGST (9%):", "₹" + invoice.getCgstAmount(), normalFont, normalFont);
                addCalculationRow(totalTable, "SGST (9%):", "₹" + invoice.getSgstAmount(), normalFont, normalFont);
            }

            addCalculationRow(totalTable, "Total Paid / Due:", "₹" + invoice.getTotalAmount(), totalFont, totalFont);
            addCalculationRow(totalTable, "Payment Method:", invoice.getPaymentMethod().name(), normalFont, normalFont);

            document.add(new Paragraph(" "));
            document.add(totalTable);

            // Footer Note
            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph("Thank you for choosing SmartPark! Have a safe drive.", subtitleFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

    private void addCalculationRow(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setPadding(4);
        PdfPCell c2 = new PdfPCell(new Phrase(value, valFont));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c2.setPadding(4);
        table.addCell(c1);
        table.addCell(c2);
    }
}
