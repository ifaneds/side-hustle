package com.sidehustle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
            @RequestParam(required = false) String generalSearch,
            @RequestParam(required = false) List<String> location,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) BigDecimal minPayRate,
            @RequestParam(required = false) BigDecimal maxPayRate,
            @RequestParam(required = false) List<String> skills
    ) {

        BigDecimal adjustedMinPayRate = (minPayRate == null) ? BigDecimal.ZERO : minPayRate;
        BigDecimal adjustedMaxPayRate = (maxPayRate == null) ? new BigDecimal("999999999999999999999999999999") : maxPayRate; // A very large number

        List<String> processedLocation = (location == null || location.isEmpty()) ? null : location;
        List<String> processedCategory = (category == null || category.isEmpty()) ? null : category;
        List<String> processedSkills = (skills == null || skills.isEmpty()) ? null : skills;

        System.out.println("Search: " + generalSearch);
        System.out.println("Location (processed): " + processedLocation);
        System.out.println("Category (processed): " + processedCategory);
        System.out.println("Min Pay Rate: " + adjustedMinPayRate);
        System.out.println("Max Pay Rate: " + adjustedMaxPayRate);
        System.out.println("Skills: " + processedSkills);

        List<Job> jobs;
        if (processedSkills != null) {
            jobs = jobRepository.findJobsByFilters(
                    generalSearch, processedLocation, processedCategory, adjustedMinPayRate, adjustedMaxPayRate, processedSkills);
        } else {
            jobs = jobRepository.findJobsWithoutSkillsFilter(
                    generalSearch, processedLocation, processedCategory, adjustedMinPayRate, adjustedMaxPayRate);
        }

        System.out.println("Jobs found: " + jobs.size());

        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jobs);
        }

        return ResponseEntity.ok(jobs);
    }
}