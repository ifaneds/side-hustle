package com.sidehustle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    @Autowired
    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPayRate,
            @RequestParam(required = false) BigDecimal maxPayRate,
            @RequestParam(required = false) List<String> skills) {

                BigDecimal adjustedMinPayRate = (minPayRate == null) ? BigDecimal.ZERO : minPayRate;
                BigDecimal adjustedMaxPayRate = (maxPayRate == null) ? new BigDecimal("999999999999999999999999999999") : maxPayRate; // A very large number

                System.out.println("Title: " + title); // Debugging line to check the title parameter
                System.out.println("Location: " + location); // Debugging line to check the location parameter
                System.out.println("Category: " + category); // Debugging line to check the category parameter
                System.out.println("Min Pay Rate: " + adjustedMinPayRate); // Debugging line to check the min pay rate parameter
                System.out.println("Max Pay Rate: " + adjustedMaxPayRate); // Debugging line to check the max pay rate parameter
                System.out.println("Skills: " + skills); // Debugging line to check the skills parameter

               
                                List<Job> jobs;
                if (skills != null && !skills.isEmpty()) {
                    jobs = jobRepository.findJobsByFilters(
                            title, location, category, adjustedMinPayRate, adjustedMaxPayRate, skills);
                } else {
                    // If skills is null or empty, call a method that doesn't include the skills filter
    jobs = jobRepository.findJobsWithoutSkillsFilter(
                           title, location, category, adjustedMinPayRate, adjustedMaxPayRate);
                }
                   System.out.println("Jobs found: " + jobs.size()); // Debugging line to check the number of jobs found
        return ResponseEntity.ok(jobs);
    }
}