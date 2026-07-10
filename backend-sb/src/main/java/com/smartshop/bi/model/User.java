package com.smartshop.bi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role = "Super Administrator";
    private String joinedDate = LocalDateTime.now().toLocalDate().toString();
    private String avatar = "A";
    
    // Forgot Password Fields
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    // Preferences
    private String theme = "dark";
    private UserNotifications notifications = new UserNotifications();

    public static class UserNotifications {
        private boolean emailAlerts = true;
        private boolean orderUpdates = true;
        private boolean weeklyDigest = false;
        private boolean securityAlerts = true;

        // Getters and Setters
        public boolean isEmailAlerts() { return emailAlerts; }
        public void setEmailAlerts(boolean emailAlerts) { this.emailAlerts = emailAlerts; }

        public boolean isOrderUpdates() { return orderUpdates; }
        public void setOrderUpdates(boolean orderUpdates) { this.orderUpdates = orderUpdates; }

        public boolean isWeeklyDigest() { return weeklyDigest; }
        public void setWeeklyDigest(boolean weeklyDigest) { this.weeklyDigest = weeklyDigest; }

        public boolean isSecurityAlerts() { return securityAlerts; }
        public void setSecurityAlerts(boolean securityAlerts) { this.securityAlerts = securityAlerts; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getJoinedDate() { return joinedDate; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public UserNotifications getNotifications() { return notifications; }
    public void setNotifications(UserNotifications notifications) { this.notifications = notifications; }
}
