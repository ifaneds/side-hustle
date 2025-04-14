package com.sidehustle.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE " +
            "(:title = '' OR :title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:location IS NULL OR j.location IN :location) AND " +
            "(:category IS NULL OR j.category IN :category) AND " +
            "(:minPayRate IS NULL OR j.payRate >= :minPayRate) AND " +
            "(:maxPayRate IS NULL OR j.payRate <= :maxPayRate) AND " +
            "(CASE WHEN :skills IS NULL THEN TRUE ELSE EXISTS (SELECT s FROM j.skills s WHERE s.name IN :skills) END)")
    List<Job> findJobsByFilters(
            @Param("title") String title,
            @Param("location") List<String> location,
            @Param("category") List<String> category,
            @Param("minPayRate") BigDecimal minPayRate,
            @Param("maxPayRate") BigDecimal maxPayRate,
            @Param("skills") List<String> skills
    );

    @Query("SELECT j FROM Job j WHERE " +
            "(:title = '' OR :title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:location IS NULL OR j.location IN :location) AND " +
            "(:category IS NULL OR j.category IN :category) AND " +
            "(:minPayRate IS NULL OR j.payRate >= :minPayRate) AND " +
            "(:maxPayRate IS NULL OR j.payRate <= :maxPayRate)")
    List<Job> findJobsWithoutSkillsFilter(
            @Param("title") String title,
            @Param("location") List<String> location,
            @Param("category") List<String> category,
            @Param("minPayRate") BigDecimal minPayRate,
            @Param("maxPayRate") BigDecimal maxPayRate
    );
}