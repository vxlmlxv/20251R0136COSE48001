package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.ActionSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionSummaryRepository extends JpaRepository<ActionSummary, Long> {
    Optional<ActionSummary> findByDetectedActionId(Long detectedActionId);
}
