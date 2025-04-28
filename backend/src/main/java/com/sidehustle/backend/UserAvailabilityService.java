package com.sidehustle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserAvailabilityService {
    private static final Logger logger = LoggerFactory.getLogger(UserAvailabilityService.class);

    @Autowired
    private UserAvailabilityRepository userAvailabilityRepository;

    /**
     * Saves user availability data, handling the business logic of converting
     * raw data into domain objects and managing existing records
     */
    @Transactional
    public void saveUserAvailability(Map<String, Object> availabilityData) {
        logger.info("Received availability data: {}", availabilityData);
        
        List<Map<String, Object>> events = (List<Map<String, Object>>) availabilityData.get("unavailableEvents");
        
        // Handle user ID properly - it could be a number or a string
        Object userIdObj = availabilityData.get("userId");
        logger.info("User ID object: {}, type: {}", userIdObj, userIdObj != null ? userIdObj.getClass().getName() : "null");
        
        Long userId;
        
        if (userIdObj == null) {
            logger.error("User ID is null");
            throw new IllegalArgumentException("User ID is required");
        } else if (userIdObj instanceof Number) {
            userId = ((Number) userIdObj).longValue();
            logger.info("Parsed user ID as Number: {}", userId);
        } else if (userIdObj instanceof String) {
            try {
                userId = Long.parseLong((String) userIdObj);
                logger.info("Parsed user ID as String: {}", userId);
            } catch (NumberFormatException e) {
                logger.error("Failed to parse user ID string: {}", userIdObj);
                throw new IllegalArgumentException("Invalid user ID format: " + userIdObj);
            }
        } else {
            logger.error("User ID is of unsupported type: {}", userIdObj.getClass().getName());
            throw new IllegalArgumentException("Invalid user ID format: " + userIdObj);
        }

        // Business rule: Clear existing availability before saving new ones
        userAvailabilityRepository.deleteByUserId(userId);

        // Business logic: Convert raw event data to domain objects
        List<UserAvailability> availabilityList = convertEventsToAvailability(events, userId);

        // Persist the domain objects
        userAvailabilityRepository.saveAll(availabilityList);
    }

    /**
     * Retrieves all availability entries for a given user
     */
    @Transactional(readOnly = true)
    public List<UserAvailability> getUserAvailability(Long userId) {
        return userAvailabilityRepository.findByUserId(userId);
    }

    /**
     * Business logic to convert raw event data into domain objects
     */
    private List<UserAvailability> convertEventsToAvailability(List<Map<String, Object>> events, Long userId) {
        List<UserAvailability> availabilityList = new ArrayList<>();
        
        for (Map<String, Object> event : events) {
            UserAvailability availability = new UserAvailability();
            availability.setUserId(userId);
            
            String startTimeStr = event.get("start").toString();
            String endTimeStr = event.get("end").toString();
            String timeZoneStr = event.get("timeZone").toString();
            
            logger.info("Processing event times - Start: {}, End: {}, TimeZone: {}", 
                startTimeStr, endTimeStr, timeZoneStr);
            
            try {
                // Parse the ISO datetime strings to get the date and time components
                OffsetDateTime startDateTime = OffsetDateTime.parse(startTimeStr);
                OffsetDateTime endDateTime = OffsetDateTime.parse(endTimeStr);
                
                // Get the timezone
                ZoneId zoneId = ZoneId.of(timeZoneStr);
                
                // Extract the time components
                int startHour = startDateTime.getHour();
                int startMinute = startDateTime.getMinute();
                int endHour = endDateTime.getHour();
                int endMinute = endDateTime.getMinute();
                
                // Create ZonedDateTime objects in the target timezone
                ZonedDateTime startZoned = startDateTime.atZoneSameInstant(zoneId)
                    .withHour(startHour)
                    .withMinute(startMinute);
                ZonedDateTime endZoned = endDateTime.atZoneSameInstant(zoneId)
                    .withHour(endHour)
                    .withMinute(endMinute);
                
                // Convert to OffsetDateTime for storage
                OffsetDateTime startTimeInZone = startZoned.toOffsetDateTime();
                OffsetDateTime endTimeInZone = endZoned.toOffsetDateTime();
                
                logger.info("Converted times - Start: {}, End: {}", 
                    startTimeInZone.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                    endTimeInZone.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
                
                availability.setStartTime(startTimeInZone);
                availability.setEndTime(endTimeInZone);
                availability.setTimeZone(timeZoneStr);
                
                availabilityList.add(availability);
            } catch (Exception e) {
                logger.error("Error processing event times", e);
                throw new IllegalArgumentException("Invalid time format: " + e.getMessage());
            }
        }
        
        return availabilityList;
    }
} 