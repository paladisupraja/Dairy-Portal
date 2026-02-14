// src/pages/Notifications.js
import React, { useEffect, useMemo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Divider
} from "@mui/material";
import { getNotifications, markAsReadNotifications } from "../../services";
import { NotificationContext } from "../../context/NotificationContext";

const Notifications = () => {
  const { setNotifications, refreshUnreadCount } = useContext(NotificationContext);
  const [notifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";
  const employeeFarmId = user?.farm_id;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      let data = res?.details || res?.data?.details || [];

      if (isEmployee && employeeFarmId) {
        data = data.filter((n) => Number(n.farm_id) === Number(employeeFarmId));
      }

      setLocalNotifications(data);
      setNotifications(data);
      refreshUnreadCount();
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const uniqueNotifications = useMemo(() => {
    const map = new Map();
    notifications.forEach((item) => {
      const key = item.message + item.animal_tag_no + new Date(item.created_at).getTime();
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [notifications]);

  const isReadCheck = (value) => value === true || value === "true" || value === 1;
  const formatDate = (date) => new Date(date).toLocaleString();

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Optimistic update
      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, isRead: true } : n
        )
      );

      refreshUnreadCount();
      await markAsReadNotifications({ notificationIds: [notificationId] });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  if (loading) {
    return (
      <Box height="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography
          sx={{ cursor: "pointer", color: "rgb(42,8,11)", fontWeight: 600, minWidth: "80px" }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Typography>
        <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ flex: 1 }}>
          Notifications
        </Typography>
        <Box sx={{ minWidth: "80px" }} />
      </Box>

      <Stack spacing={2}>
        {uniqueNotifications.map((item) => {
          const unread = !isReadCheck(item.isRead);
          return (
            <Paper
              key={item.notification_id}
              onClick={() => unread && handleMarkAsRead(item.notification_id)}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                borderLeft: unread ? "4px solid #f44336" : "4px solid #ccc",
                backgroundColor: unread ? "#fff" : "#f9f9f9",
                cursor: unread ? "pointer" : "default",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                "&:hover": unread ? { backgroundColor: "#fefefe" } : {}
              }}
            >
              <Typography variant="body1" fontWeight={unread ? 700 : 500} mb={1} color={unread ? "error" : "text.primary"}>
                {item.message || "No Message"}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" justifyContent="space-between" flexWrap="wrap" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Animal Tag:</strong> {item.animal_tag_no || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Farm ID:</strong> {item.farm_id || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Employee IDs:</strong>{" "}
                  {item.employee_ids && item.employee_ids.length
                    ? item.employee_ids.filter(Boolean).join(", ")
                    : "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Type:</strong> {item.type?.toUpperCase() || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Date:</strong> {formatDate(item.created_at)}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Notifications;
