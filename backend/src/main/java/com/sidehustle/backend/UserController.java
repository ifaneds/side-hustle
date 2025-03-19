package com.sidehustle.backend;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private String jwtSecret = System.getenv("JWT_SECRET");

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // 1. Hash the password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        // 2. Save the user to the database (using your data access layer)
        // ... (Your database saving logic here) ...

return new ResponseEntity<>("Account created successfully", HttpStatus.CREATED);   
 }

     @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User storedUser = userRepository.findByEmail(user.getEmail()); // Assuming you have findByEmail method
        if (storedUser == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        if (passwordEncoder.matches(user.getPassword(), storedUser.getPassword())) {
            String token = generateJwtToken(storedUser.getEmail());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    private String generateJwtToken(String email) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        long expMillis = nowMillis + 3600000; // 1 hour expiration
        Date exp = new Date(expMillis);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes()); //reate key from secret key string
        
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith( key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/users")
    public Iterable<User> findAllUsers() {
      return this.userRepository.findAll();
    }
  
    @PostMapping("/users")
    public User addOnUser(@RequestBody User user) {
      return this.userRepository.save(user);
    }
}