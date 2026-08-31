/**
 * Indian Rupee (₹ INR) Formatter
 * Example: 1500 -> ₹1,500
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(numericAmount);
};

/**
 * Format ISO Date/Time to Indian Standard Time (IST)
 * Example: "2026-08-30T10:30:00" -> "30-Aug-2026, 10:30 AM"
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  try {
    if (timeString.length === 5 || timeString.length === 8) {
      const [h, m] = timeString.split(':');
      const d = new Date();
      d.setHours(parseInt(h), parseInt(m));
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return timeString;
  } catch {
    return timeString;
  }
};

/**
 * Validates Indian Vehicle Registration Format (e.g. MH 12 AB 1234)
 */
export const isValidIndianVehicleNumber = (num) => {
  if (!num) return false;
  const regex = /^[A-Z]{2}[\s\-]?[0-9]{1,2}[\s\-]?[A-Z]{1,3}[\s\-]?[0-9]{4}$/i;
  return regex.test(num.trim());
};

/**
 * Validates 10-digit Indian Mobile Number
 */
export const isValidIndianMobile = (mobile) => {
  if (!mobile) return false;
  const regex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  return regex.test(mobile.trim());
};
