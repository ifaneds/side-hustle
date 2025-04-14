package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    @Query("SELECT DISTINCT s.name FROM Skill s ORDER BY s.name")
    List<String> findAllSkills(); // Assuming you want all skills for the dropdown
}