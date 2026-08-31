package com.smartpark.service;

import com.smartpark.dto.response.NotificationResponse;
import com.smartpark.entity.User;
import com.smartpark.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void sendNotification(User user, String title, String message, NotificationType type);
    List<NotificationResponse> getUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}
