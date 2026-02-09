
import React, { useEffect } from 'react';

interface NotificationToastProps {
  message: string;
  type: 'email' | 'success';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-bounce-in">
      <div className={`flex items-center p-4 rounded-2xl shadow-xl border ${
        type === 'email' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-emerald-600 border-emerald-400 text-white'
      }`}>
        <div className="mr-3">
          {type === 'email' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Notification</p>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
