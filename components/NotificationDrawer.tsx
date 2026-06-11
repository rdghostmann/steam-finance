import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Check, Trash2, MailOpen, AlertCircle } from 'lucide-react';
import { AppNotification } from '@/types';
// import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (id: string) => void;
  isDarkMode: boolean;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onNotificationClick,
  isDarkMode
}: NotificationDrawerProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Side Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`relative w-full max-w-sm h-full flex flex-col shadow-2xl transition-colors duration-300 ${
              isDarkMode ? 'bg-wallet-dark text-white' : 'bg-white text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b flex justify-between items-center ${
              isDarkMode ? 'border-wallet-dark-card-lighter' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <div className="relative p-2 bg-wallet-purple/10 text-wallet-purple rounded-xl">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">Notifications</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">User Terminal alerts log</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:scale-105 transition-transform ${
                  isDarkMode ? 'bg-wallet-dark-card text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions Toolbar */}
            {notifications.length > 0 && (
              <div className={`px-6 py-3 flex justify-between items-center text-xs border-b ${
                isDarkMode ? 'bg-wallet-dark-card/50 border-wallet-dark-card-lighter' : 'bg-slate-50 border-slate-100'
              }`}>
                <button
                  onClick={onMarkAllRead}
                  className="text-wallet-purple hover:underline font-semibold flex items-center gap-1"
                >
                  <MailOpen className="w-3.5 h-3.5" /> Mark all read
                </button>
                <button
                  onClick={onClearAll}
                  className="text-red-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}

            {/* Notifications Alert List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-20 space-y-2">
                  <Bell className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">No active notifications</p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">Simulation actions trigger immediate alerts here.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onNotificationClick(notif.id)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      notif.read
                        ? isDarkMode 
                          ? 'bg-wallet-dark-card/45 border-transparent opacity-75' 
                          : 'bg-slate-50/70 border-transparent opacity-75'
                        : isDarkMode
                          ? 'bg-wallet-dark-card border-wallet-purple/20 shadow-md shadow-wallet-purple/5'
                          : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`text-xs font-bold font-display ${
                        notif.read ? 'text-slate-400' : isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-wallet-purple shrink-0 mt-1" />
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-slate-500 mt-2 block font-semibold font-mono">
                      {notif.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
