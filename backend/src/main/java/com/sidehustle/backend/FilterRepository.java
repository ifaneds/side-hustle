package com.sidehustle.backend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FilterRepository extends JpaRepository<Job, Long> { // Extend with a generic type as it's not tied to a specific entity

    @Query("SELECT DISTINCT j.location FROM Job j WHERE j.location IS NOT NULL AND j.location <> '' ORDER BY j.location")
    List<String> findDistinctLocations();

    @Query("SELECT DISTINCT j.category FROM Job j WHERE j.category IS NOT NULL AND j.category <> '' ORDER BY j.category")
    List<String> findDistinctCategories();


}