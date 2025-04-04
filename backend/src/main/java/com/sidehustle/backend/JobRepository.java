package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE " +
           "(:title = '' OR :title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(CASE WHEN :location = '' THEN TRUE ELSE LOWER(CAST(j.location AS STRING)) = LOWER(:location) END) AND " +
           "(CASE WHEN :category = '' THEN TRUE ELSE LOWER(CAST(j.category AS STRING)) = LOWER(:category) END) AND " +
           "(:minPayRate IS NULL OR j.payRate >= :minPayRate) AND " +
           "(:maxPayRate IS NULL OR j.payRate <= :maxPayRate) AND " +
           "(CASE WHEN :skills IS NULL THEN TRUE ELSE (SELECT COUNT(s) FROM j.skills s WHERE s.name IN :skills) > 0 END)")
    List<Job> findJobsByFilters(
            @Param("title") String title,
            @Param("location") String location,
            @Param("category") String category,
            @Param("minPayRate") BigDecimal minPayRate,
            @Param("maxPayRate") BigDecimal maxPayRate,
            @Param("skills") List<String> skills
    );

    @Query("SELECT j FROM Job j WHERE " +
           "(:title = '' OR :title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(CASE WHEN :location = '' THEN TRUE ELSE LOWER(CAST(j.location AS STRING)) = LOWER(:location) END) AND " +
           "(CASE WHEN :category = '' THEN TRUE ELSE LOWER(CAST(j.category AS STRING)) = LOWER(:category) END) AND " +
           "(:minPayRate IS NULL OR j.payRate >= :minPayRate) AND " +
           "(:maxPayRate IS NULL OR j.payRate <= :maxPayRate)")
    List<Job> findJobsWithoutSkillsFilter(
            @Param("title") String title,
            @Param("location") String location,
            @Param("category") String category,
            @Param("minPayRate") BigDecimal minPayRate,
            @Param("maxPayRate") BigDecimal maxPayRate
    );
}