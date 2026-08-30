import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminAuthModal = ({ isOpen, onClose, onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 8-character master password from .env or fallback
  const CORRECT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'K9m#7P2w';

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      localStorage.setItem('sanarip_admin_auth', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setErrorMessage('Неверный пароль доступа');
      setTimeout(() => setError(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-[#0F1722] rounded-2xl p-6 sm:p-8 border border-slate-800 z-10 text-white shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#09638D]/20 border border-[#09638D]/40 text-[#61DED3] flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Вход в панель управления
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Введите мастер-пароль администратора
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите 8-значный пароль"
                value={password}
                autoFocus
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-900 border text-white text-sm font-medium focus:outline-none transition-colors ${
                  error ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-[#09638D]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-400 text-xs font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#09638D] hover:bg-[#08557a] text-white text-xs font-bold transition-colors cursor-pointer active:scale-[0.99]"
            >
              <span>Войти в админку</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Безопасный доступ</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Защищено</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
