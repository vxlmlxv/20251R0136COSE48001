package com.preffy.videoflow.repository;

import com.preffy.videoflow.entity.BodyLanguageAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BodyLanguageAnalysisRepository extends JpaRepository<BodyLanguageAnalysis, Long> {
    
    Optional<BodyLanguageAnalysis> findByProjectId(String projectId);
    
    boolean existsByProjectId(String projectId);
    
    void deleteByProjectId(String projectId);
}
