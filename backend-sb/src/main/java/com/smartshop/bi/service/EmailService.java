package com.smartshop.bi.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("SmartShop BI Platform - Reset Your Password");
            message.setText("Click the following link to reset your password. The link is valid for 15 minutes:\n" + resetLink);
            mailSender.send(message);
            System.out.println("✅ Reset email sent to " + toEmail + " via SMTP.");
        } catch (Exception ex) {
            System.out.println("⚠️ SMTP Server not available. Reset password link logged to console:");
            System.out.println("👉 RESET LINK FOR " + toEmail + ": " + resetLink);
        }
    }
}
