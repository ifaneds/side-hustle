// Job.java
package com.sidehustle.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 255, columnDefinition = "character varying")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 255, columnDefinition = "character varying")
    private String location;

    @JsonProperty("pay_rate")
    @Column(name = "pay_rate", precision = 10, scale = 2)
    private BigDecimal payRate;

    @Column(name = "category", length = 100, columnDefinition = "character varying")
    private String category;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    
    @JsonProperty("user_id")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToMany (fetch = FetchType.LAZY) // Use LAZY loading to avoid fetching skills unless needed
    @JoinTable(
        name = "job_skills",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skill> skills;

    public Job() {}

    public Job(String title, String description, String location, BigDecimal payRate, String category, Long userId, List<Skill> skills) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.payRate = payRate;
        this.category = category;
        this.userId = userId;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPayRate() {
        return payRate;
    }

    public void setPayRate(BigDecimal payRate) {
        this.payRate = payRate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    @Override
    public String toString() {
        return "Job{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", payRate=" + payRate +
                ", category='" + category + '\'' +
                ", userId=" + userId +
                ", createdAt=" + createdAt +
                '}';
    }
}