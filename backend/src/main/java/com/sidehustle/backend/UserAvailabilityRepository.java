package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, Long> {
    List<UserAvailability> findByUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM UserAvailability ua WHERE ua.userId = :userId")
    void deleteByUserId(Long userId);
} 