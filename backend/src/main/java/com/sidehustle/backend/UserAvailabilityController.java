package com.sidehustle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:3000")
@ComponentScan("com.sidehustle.backend")
public class UserAvailabilityController {
    private static final Logger logger = LoggerFactory.getLogger(UserAvailabilityController.class);

    @Autowired
    private UserAvailabilityService userAvailabilityService;

    /**
     * HTTP endpoint for saving user availability
     * Handles HTTP-specific concerns like request body parsing and response formatting
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveAvailability(@RequestBody Map<String, Object> availabilityData, 
                                            @RequestHeader(value = "Origin", required = false) String origin) {
        logger.info("Received save availability request from origin: {} with data: {}", origin, availabilityData);
        try {
            if (!availabilityData.containsKey("userId") || !availabilityData.containsKey("unavailableEvents")) {
                logger.warn("Missing required fields in request");
                return ResponseEntity.badRequest()
                    .body("Missing required fields: userId and unavailableEvents are required");
            }

            // Log the user ID type and value for debugging
            Object userIdObj = availabilityData.get("userId");
            logger.info("User ID type: {}, value: {}", userIdObj != null ? userIdObj.getClass().getName() : "null", userIdObj);

            // Delegate business logic to service
            userAvailabilityService.saveUserAvailability(availabilityData);
            logger.info("Successfully saved availability for user: {}", availabilityData.get("userId"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // HTTP-specific error handling
            logger.error("Error saving availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving availability: " + e.getMessage());
        }
    }

    /**
     * HTTP endpoint for retrieving user availability
     * Handles HTTP-specific concerns like path variables and response formatting
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAvailability>> getUserAvailability(@PathVariable Long userId,
                                                                     @RequestHeader(value = "Origin", required = false) String origin) {
        logger.info("Received get availability request for user: {} from origin: {}", userId, origin);
        try {
            if (userId == null) {
                logger.warn("User ID is null");
                return ResponseEntity.badRequest().body(null);
            }
            
            // Delegate business logic to service and wrap response
            List<UserAvailability> availability = userAvailabilityService.getUserAvailability(userId);
            logger.info("Found {} availability entries for user: {}", availability.size(), userId);
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            logger.error("Error getting availability for user: " + userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }

    // Test endpoint to verify routing
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("UserAvailabilityController is working");
    }
} 