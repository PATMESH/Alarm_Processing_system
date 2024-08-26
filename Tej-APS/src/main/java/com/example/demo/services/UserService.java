package com.example.demo.services;

import com.example.demo.dto.LoginDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElse(null);
    }

    public ResponseEntity<?> login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail());
        if (user != null && user.getPassword().equals(loginDTO.getPassword())) {
            String token = generateToken(user);
            Map<String, Object> response = new HashMap<>(); 
            response.put("name", user.getName());
            response.put("employeeId", user.getId());  
            response.put("userType", user.getRole());
            response.put("nms", user.getNms() != null ? user.getNms().getId() : 0);
            
            return ResponseEntity.ok(response);
        } else {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
    
    
    
    
    
    
    private String generateToken(User user) {
        return ("userId=" + user.getId() + ", email=" + user.getEmail());
    }
}
