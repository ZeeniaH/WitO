import React, { createContext, useState, useEffect, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        setNotifications(storedNotifications);
        setNotificationCount(storedNotifications.length);
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
        setNotificationCount(notifications.length);
    }, [notifications]);

    const addNotification = (notification) => {
        setNotifications((prevNotifications) => {
            // Use unshift to add the new notification at the beginning of the array
            const updatedNotifications = [notification, ...prevNotifications];
            return updatedNotifications;
        });
    };

    const removeNotification = (index) => {
        setNotifications((prevNotifications) => {
            // Create a copy of the notifications array
            const updatedNotifications = [...prevNotifications];

            // Remove the notification at the specified index
            updatedNotifications.splice(index, 1);

            return updatedNotifications;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                notificationCount,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook to access the NotificationContext
export const useNotification = () => {
    return useContext(NotificationContext);
};

export default NotificationContext;