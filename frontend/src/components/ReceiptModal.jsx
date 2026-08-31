import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { bookingService } from '../services/bookingService';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReceiptModal({ isOpen, onClose, invoiceId, bookingId }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    const fetchInvoice = async () => {
      try {
        let res;
        if (invoiceId) {
          res = await bookingService.getInvoice(invoiceId);
        } else if (bookingId) {
          res = await bookingService.getInvoiceByBookingId(bookingId);
        }
        if (res?.data) {
          setInvoice(res.data);
        }
      } catch (err) {
        setError(err.message || 'Invoice details not available yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [isOpen, invoiceId, bookingId]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    if (invoice?.id) {
      window.open(bookingService.getInvoicePdfUrl(invoice.id), '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Invoice Header */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">SmartPark Tax Invoice 🇮🇳</h3>
              <p className="text-[11px] text-slate-400">GST-Compliant Parking Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-left text-xs max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500 font-semibold">Generating tax invoice...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 rounded-2xl text-rose-700">
              <p className="font-semibold">{error}</p>
            </div>
          ) : invoice ? (
            <>
              {/* Meta Info Box */}
              <div className="flex items-start justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Invoice Number</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{invoice.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Booking Ref: <span className="font-bold text-slate-700">{invoice.bookingNumber}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Generated Date</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{formatDateTime(invoice.generatedAt)}</p>
                  <div className="mt-1.5">
                    <StatusBadge status={invoice.paymentStatus} />
                  </div>
                </div>
              </div>

              {/* Customer & Facility Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Customer Details</span>
                  <p className="font-bold text-slate-800 text-xs mt-1">{invoice.customerName}</p>
                  <p className="text-slate-500 text-[11px]">{invoice.customerMobile}</p>
                  <p className="text-brand-600 font-bold text-[11px] mt-1">{invoice.vehicleNumber} ({invoice.vehicleType})</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Parking Facility</span>
                  <p className="font-bold text-slate-800 text-xs mt-1">{invoice.locationName}</p>
                  <p className="text-slate-500 text-[11px] truncate">{invoice.locationAddress}</p>
                  <p className="text-slate-700 font-bold text-[11px] mt-1">{invoice.floorName} - Slot {invoice.slotNumber}</p>
                </div>
              </div>

              {/* Duration Table */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Entry Time:</span>
                  <span className="font-bold text-slate-800">{formatDateTime(invoice.entryTime)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Exit Time:</span>
                  <span className="font-bold text-slate-800">{formatDateTime(invoice.exitTime)}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>Total Duration:</span>
                  <span className="font-bold text-brand-600">{invoice.durationHours} hours</span>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Parking Charges</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(invoice.parkingCharges)}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- {formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}

                {invoice.cgstAmount > 0 && (
                  <>
                    <div className="flex justify-between text-slate-500">
                      <span>CGST (9%)</span>
                      <span>{formatCurrency(invoice.cgstAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>SGST (9%)</span>
                      <span>{formatCurrency(invoice.sgstAmount)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-brand-600 text-base font-black">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
