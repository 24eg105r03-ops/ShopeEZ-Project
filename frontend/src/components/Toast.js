import React, { useState, useEffect } from 'react';

let toastId = 0;
export const toast = {
  success: (message) => {
    window.dispatchEvent(
      new CustomEvent('shopez-toast', { detail: { id: toastId++, type: 'success', message } })
    );
  },
  error: (message) => {
    window.dispatchEvent(
      new CustomEvent('shopez-toast', { detail: { id: toastId++, type: 'error', message } })
    );
  },
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { id, type, message } = e.detail;
      setToasts((prev) => [...prev, { id, type, message }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('shopez-toast', handleToast);
    return () => window.removeEventListener('shopez-toast', handleToast);
  }, []);

  return (
    <div className="toast-container-custom">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-custom ${t.type}`}>
          <i
            className={
              t.type === 'success'
                ? 'fa-solid fa-circle-check text-success fs-5'
                : 'fa-solid fa-circle-exclamation text-danger fs-5'
            }
          ></i>
          <span className="fw-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
