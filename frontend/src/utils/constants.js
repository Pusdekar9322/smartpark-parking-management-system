export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  PARKING_ADMIN: 'ROLE_PARKING_ADMIN',
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN'
};

export const VEHICLE_TYPES = [
  { id: 'CAR', label: 'Car', icon: 'Car', desc: 'Hatchback, Sedan, Mini' },
  { id: 'BIKE', label: 'Bike / Two-Wheeler', icon: 'Bike', desc: 'Scooter, Motorcycle' },
  { id: 'SUV', label: 'SUV / Premium', icon: 'Truck', desc: 'Large SUV, MUV' },
  { id: 'EV', label: 'EV (Electric)', icon: 'Zap', desc: 'Electric with fast charging' }
];

export const PAYMENT_METHODS = {
  ONLINE_UPI: { label: 'UPI (GPay / PhonePe / Paytm)', category: 'ONLINE' },
  ONLINE_CARD: { label: 'Credit / Debit Card', category: 'ONLINE' },
  ONLINE_NET_BANKING: { label: 'Net Banking', category: 'ONLINE' },
  CASH_AT_PARKING: { label: 'Cash at Counter', category: 'OFFLINE' },
  UPI_AT_PARKING: { label: 'UPI at Parking Counter', category: 'OFFLINE' },
  CARD_AT_PARKING: { label: 'Card at Parking Counter', category: 'OFFLINE' }
};

export const POPULAR_CITIES = [
  'Pune',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Delhi',
  'Nagpur',
  'Nashik'
];
