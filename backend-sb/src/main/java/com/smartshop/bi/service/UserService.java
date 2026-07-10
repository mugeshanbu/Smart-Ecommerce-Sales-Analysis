package com.smartshop.bi.service;

import com.smartshop.bi.model.User;
import com.smartshop.bi.repository.UserRepository;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.net.Socket;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    private static boolean useInMemory = false;
    private static final Map<String, User> inMemoryDb = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        try (Socket socket = new Socket("localhost", 27017)) {
            System.out.println("✅ MongoDB detected on port 27017. Using MongoDB repository.");
            useInMemory = false;
        } catch (Exception e) {
            System.out.println("⚠️ MongoDB NOT detected on port 27017. Falling back to In-Memory repository storage!");
            useInMemory = true;
        }

        // Add default admin user in-memory so demo login works immediately
        User admin = new User();
        admin.setId("admin_id");
        admin.setName("Administrator");
        admin.setEmail("admin@smartshop.com");
        // BCrypt hash of admin123
        admin.setPassword("$2a$10$wK1k6iV6h51z0J6dFz.q7Og5yY6c7UqR2.N8/VjR0fCjM1ZcZ5K1m");
        inMemoryDb.put("admin@smartshop.com", admin);
    }

    public static boolean isInMemory() {
        return useInMemory;
    }

    public Optional<User> findByEmail(String email) {
        if (useInMemory) {
            return Optional.ofNullable(inMemoryDb.get(email));
        }
        try {
            return userRepository.findByEmail(email);
        } catch (Exception ex) {
            System.err.println("Database error, switching to in-memory: " + ex.getMessage());
            useInMemory = true;
            return Optional.ofNullable(inMemoryDb.get(email));
        }
    }

    public Optional<User> findByResetToken(String token) {
        if (useInMemory) {
            return inMemoryDb.values().stream()
                    .filter(u -> token.equals(u.getResetToken()))
                    .findFirst();
        }
        try {
            return userRepository.findByResetToken(token);
        } catch (Exception ex) {
            useInMemory = true;
            return inMemoryDb.values().stream()
                    .filter(u -> token.equals(u.getResetToken()))
                    .findFirst();
        }
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        inMemoryDb.put(user.getEmail(), user);
        
        if (!useInMemory) {
            try {
                return userRepository.save(user);
            } catch (Exception ex) {
                System.err.println("Database write error, switching to in-memory: " + ex.getMessage());
                useInMemory = true;
            }
        }
        return user;
    }
}
