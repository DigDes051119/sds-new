import { useState, useEffect, useCallback } from 'react';

const ADMIN_STORAGE_KEY = 'sanarip_admin_auth';

/**
 * Custom Hook to handle Admin authentication, hash routing (#admin / #analytics),
 * global CustomEvent triggers, and keyboard shortcuts (Ctrl+Shift+A).
 */
export function useAdminAuth() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const checkAuthAndOpen = useCallback(() => {
    const isAuth = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    if (isAuth) {
      setIsAdminOpen(true);
      setIsAuthModalOpen(false);
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  const closeAdmin = useCallback(() => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#analytics') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#analytics') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const onAuthenticated = useCallback(() => {
    setIsAuthModalOpen(false);
    setIsAdminOpen(true);
  }, []);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#analytics') {
        checkAuthAndOpen();
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('open-admin-dashboard', checkAuthAndOpen);

    const handleKeyDown = (e) => {
      // Ctrl+Shift+A / Cmd+Shift+A (or Cyrillic Ф/ф)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['A', 'a', 'Ф', 'ф'].includes(e.key)) {
        e.preventDefault();
        checkAuthAndOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('open-admin-dashboard', checkAuthAndOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [checkAuthAndOpen]);

  return {
    isAdminOpen,
    isAuthModalOpen,
    openAdmin: checkAuthAndOpen,
    closeAdmin,
    closeAuthModal,
    onAuthenticated
  };
}
