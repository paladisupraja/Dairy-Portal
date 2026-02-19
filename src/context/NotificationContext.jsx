// src/context/NotificationContext.js
import React, { createContext, useState, useEffect } from "react";
import { getNotifications } from "../services";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const isEmployee = user?.role === "employee";
      const employeeFarmId = user?.farm_id;

      const res = await getNotifications();
      let data = res?.details || res?.data?.details || [];

      if (isEmployee && employeeFarmId) {
        data = data.filter((n) => Number(n.farm_id) === Number(employeeFarmId));
      }

      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  // ✅ Auto unread count calculate
  useEffect(() => {
    const count = notifications.filter(
      (n) => n.isRead !== true && n.isRead !== "true" && n.isRead !== 1
    ).length;

    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
