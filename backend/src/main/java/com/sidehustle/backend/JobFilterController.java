package com.sidehustle.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job-filters")
public class JobFilterController {

    private final FilterRepository filterRepository;
    private final SkillRepository skillRepository;

    public JobFilterController(FilterRepository filterRepository, SkillRepository skillRepository) {
        this.filterRepository = filterRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping("/locations")
    public List<Map<String, String>> getAllLocations() {
        return filterRepository.findDistinctLocations().stream()
                .map(location -> Map.of("value", location, "label", location))
                .collect(Collectors.toList());
    }

    @GetMapping("/categories")
    public List<Map<String, String>> getAllCategories() {
        return filterRepository.findDistinctCategories().stream()
                .map(category -> Map.of("value", category, "label", category))
                .collect(Collectors.toList());
    }

    @GetMapping("/skills")
    public List<Map<String, String>> getAllSkills() {
        return skillRepository.findAllSkills().stream()
                .map(skill -> Map.of("value", skill, "label", skill))
                .collect(Collectors.toList());
    }
}