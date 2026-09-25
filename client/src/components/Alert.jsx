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
      bg: 'bg-[#34A853]/10',
      border: 'border-[#34A853]/30',
      text: 'text-[#34A853]',
      iconText: 'text-[#34A853]',
      Icon: CheckCircle2,
    },
    error: {
      bg: 'bg-[#EA4335]/10',
      border: 'border-[#EA4335]/30',
      text: 'text-[#EA4335]',
      iconText: 'text-[#EA4335]',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-[#FBBC04]/10',
      border: 'border-[#FBBC04]/30',
      text: 'text-[#FBBC04]',
      iconText: 'text-[#FBBC04]',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-[#4285F4]/10',
      border: 'border-[#4285F4]/30',
      text: 'text-[#4285F4]',
      iconText: 'text-[#4285F4]',
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
          className="p-1 rounded-lg hover:bg-[#1E2A44]/50 transition-colors"
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
