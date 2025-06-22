package com.preffy.videoflow.repository;

import com.preffy.videoflow.entity.ScriptAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScriptAnalysisRepository extends JpaRepository<ScriptAnalysis, Long> {
    Optional<ScriptAnalysis> findByProjectId(Long projectId);
}
