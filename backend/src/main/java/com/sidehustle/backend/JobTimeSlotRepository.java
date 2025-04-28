package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobTimeSlotRepository extends JpaRepository<JobTimeSlot, Long> {

 @Query ("SELECT jts FROM JobTimeSlot jts WHERE jts.jobId = :job_id")

    List<JobTimeSlot> findJobTimeSlotsByJobId(
        @Param("job_id") Long job_id);
}