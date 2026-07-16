import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Alert = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      text: 'text-emerald-800 dark:text-emerald-400',
      iconText: 'text-emerald-500',
      Icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800/50',
      text: 'text-rose-800 dark:text-rose-400',
      iconText: 'text-rose-500',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-800 dark:text-amber-400',
      iconText: 'text-amber-500',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-blue-800 dark:text-blue-400',
      iconText: 'text-blue-500',
      Icon: Info,
    },
  };

  const current = config[type] || config.info;
  const { Icon } = current;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${current.bg} ${current.border} ${current.text} shadow-sm`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${current.iconText}`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

// Global Toast Container
export const Toast = ({ message, type, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      <AnimatePresence>
        {message && (
          <Alert message={message} type={type} onClose={onClose} />
        )}
      </AnimatePresence>
    </div>
  );
};
