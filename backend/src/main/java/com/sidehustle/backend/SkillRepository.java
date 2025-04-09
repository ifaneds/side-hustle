package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    @Query("SELECT s.name FROM Skill s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findSkillNamesByNameContainingIgnoreCase(@Param("query") String query);
}