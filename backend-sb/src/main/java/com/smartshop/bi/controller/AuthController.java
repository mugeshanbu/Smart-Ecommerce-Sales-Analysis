package com.smartshop.bi.controller;

import com.smartshop.bi.config.JwtTokenProvider;
import com.smartshop.bi.model.User;
import com.smartshop.bi.service.UserService;
import com.smartshop.bi.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider, EmailService emailService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "All fields are required."));
        }

        if (userService.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email is already registered."));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userService.save(user);

        return ResponseEntity.ok(Collections.singletonMap("message", "Registration successful. Please log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            email = body.get("username");
        }
        String password = body.get("password");

        if (email == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid email or password"));
        }

        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid email or password"));
        }

        User user = userOpt.get();
        String token = tokenProvider.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("user", buildUserDto(user));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Email address not registered"));
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userService.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok(Collections.singletonMap("message", "Password reset instructions sent. Please check your inbox or server console."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");

        Optional<User> userOpt = userService.findByResetToken(token);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Invalid or expired reset token."));
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Password reset token has expired."));
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.save(user);

        return ResponseEntity.ok(Collections.singletonMap("message", "Password has been reset successfully. Please log in."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User session not found"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", buildUserDto(userOpt.get()));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User not found"));
        }

        User user = userOpt.get();
        if (body.containsKey("fullName")) user.setName((String) body.get("fullName"));
        if (body.containsKey("username")) user.setName((String) body.get("username")); // Support legacy mappings
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("theme")) user.setTheme((String) body.get("theme"));
        
        if (body.containsKey("notifications")) {
            Map<String, Object> notifMap = (Map<String, Object>) body.get("notifications");
            User.UserNotifications notifs = user.getNotifications();
            if (notifMap.containsKey("emailAlerts")) notifs.setEmailAlerts((Boolean) notifMap.get("emailAlerts"));
            if (notifMap.containsKey("orderUpdates")) notifs.setOrderUpdates((Boolean) notifMap.get("orderUpdates"));
            if (notifMap.containsKey("weeklyDigest")) notifs.setWeeklyDigest((Boolean) notifMap.get("weeklyDigest"));
            if (notifMap.containsKey("securityAlerts")) notifs.setSecurityAlerts((Boolean) notifMap.get("securityAlerts"));
        }

        userService.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile details updated successfully");
        response.put("user", buildUserDto(user));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User not found"));
        }

        User user = userOpt.get();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Incorrect current password."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userService.save(user);

        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    private Map<String, Object> buildUserDto(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("username", user.getEmail());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole());
        dto.put("fullName", user.getName());
        dto.put("avatar", user.getName() != null && !user.getName().isEmpty() ? user.getName().substring(0,1).toUpperCase() : "A");
        dto.put("joined", user.getJoinedDate());
        dto.put("theme", user.getTheme());
        
        Map<String, Boolean> notifs = new HashMap<>();
        notifs.put("emailAlerts", user.getNotifications().isEmailAlerts());
        notifs.put("orderUpdates", user.getNotifications().isOrderUpdates());
        notifs.put("weeklyDigest", user.getNotifications().isWeeklyDigest());
        notifs.put("securityAlerts", user.getNotifications().isSecurityAlerts());
        dto.put("notifications", notifs);
        
        return dto;
    }
}
