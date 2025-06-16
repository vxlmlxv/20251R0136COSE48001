package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.ActionPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionPeriodRepository extends JpaRepository<ActionPeriod, Long> {
    List<ActionPeriod> findByDetectedActionId(Long detectedActionId);
}
