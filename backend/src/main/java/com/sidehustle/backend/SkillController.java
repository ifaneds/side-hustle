package com.sidehustle.backend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping("/suggestions")
    public List<String> getSkillSuggestions(@RequestParam("query") String query) {
        return skillRepository.findSkillNamesByNameContainingIgnoreCase(query);
    }
}