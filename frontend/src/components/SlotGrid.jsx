import React, { useState } from 'react';
import { Bike, Car, Truck, Zap, Accessibility, CheckCircle2 } from 'lucide-react';

export default function SlotGrid({ floors = [], selectedSlot, onSelectSlot, selectedVehicleType }) {
  const [activeFloorId, setActiveFloorId] = useState(() => floors[0]?.floorId || null);

  if (!floors || floors.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-semibold text-slate-500">No slot layout found for this facility.</p>
      </div>
    );
  }

  // Ensure active floor is set
  const currentFloor = floors.find((f) => f.floorId === activeFloorId) || floors[0];

  const getSlotTypeIcon = (type) => {
    switch (type) {
      case 'BIKE':
        return <Bike className="w-4 h-4" />;
      case 'CAR':
        return <Car className="w-4 h-4" />;
      case 'SUV':
        return <Truck className="w-4 h-4" />;
      case 'EV':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'DISABLED':
        return <Accessibility className="w-4 h-4 text-indigo-600" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Floor Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {floors.map((floor) => {
          const isCurrent = (currentFloor?.floorId === floor.floorId);
          return (
            <button
              key={floor.floorId}
              type="button"
              onClick={() => setActiveFloorId(floor.floorId)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isCurrent
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{floor.floorName}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                isCurrent ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-700'
              }`}>
                {floor.availableSlots} free
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-600"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500 border border-rose-600"></span>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-brand-600 ring-2 ring-brand-300"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-purple-400"></span>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-200 opacity-60"></span>
          <span>Incompatible</span>
        </div>
      </div>

      {/* Visual Slot Layout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {currentFloor?.slots?.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isAvailable = slot.isAvailableForTime;
          const isMaintenance = slot.status === 'MAINTENANCE';
          const isCompatible = slot.isCompatible;

          let cardStyle = 'bg-white border-slate-200 hover:border-brand-500 hover:shadow-md cursor-pointer text-slate-800';

          if (isSelected) {
            cardStyle = 'bg-brand-600 border-brand-700 text-white ring-4 ring-brand-100 shadow-lg scale-[1.02] cursor-pointer';
          } else if (isMaintenance) {
            cardStyle = 'bg-purple-50/70 border-purple-200 text-purple-600 cursor-not-allowed opacity-75';
          } else if (!isCompatible) {
            cardStyle = 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-60';
          } else if (!isAvailable) {
            cardStyle = 'bg-rose-50 border-rose-200 text-rose-700 cursor-not-allowed opacity-80';
          }

          const canClick = isAvailable && isCompatible && !isMaintenance;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={!canClick}
              onClick={() => onSelectSlot(slot)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-24 ${cardStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {slot.slotType}
                </span>
                <div className={isSelected ? 'text-white' : 'text-slate-500'}>
                  {getSlotTypeIcon(slot.slotType)}
                </div>
              </div>

              <div>
                <span className={`text-base font-extrabold tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {slot.slotNumber}
                </span>
                <p className={`text-[10px] font-semibold mt-0.5 ${
                  isSelected
                    ? 'text-brand-100'
                    : isMaintenance
                    ? 'text-purple-600'
                    : !isCompatible
                    ? 'text-slate-400'
                    : isAvailable
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}>
                  {isSelected
                    ? 'Selected'
                    : isMaintenance
                    ? 'Maintenance'
                    : !isCompatible
                    ? 'Incompatible'
                    : isAvailable
                    ? 'Available'
                    : 'Occupied'}
                </p>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
