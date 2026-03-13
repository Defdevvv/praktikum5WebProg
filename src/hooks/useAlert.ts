import { useState, useCallback } from 'react';
import { AlertNotification } from '@/components/Alert';

export function useAlert() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);

  const addAlert = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info',
      duration = 4000
    ) => {
      const id = Date.now().toString();
      const notification: AlertNotification = {
        id,
        message,
        type,
        duration,
      };
      setNotifications((prev) => [...prev, notification]);
      return id;
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addAlert,
    removeAlert,
    clearAlerts,
  };
}
