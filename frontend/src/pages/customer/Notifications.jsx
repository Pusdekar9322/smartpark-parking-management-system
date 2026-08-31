import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { formatDateTime } from '../../utils/formatters';
import { Bell, CheckCheck, Inbox } from 'lucide-react';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications 🔔</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated with booking confirmations, gate scans, and invoice alerts</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-brand-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No notifications yet</h3>
            <p className="text-xs text-slate-500">You're all caught up with your parking alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                !n.isRead ? 'bg-brand-50/40 hover:bg-brand-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  !n.isRead ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
