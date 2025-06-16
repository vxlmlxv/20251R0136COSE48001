package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.DetectedAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectedActionRepository extends JpaRepository<DetectedAction, Long> {
    List<DetectedAction> findByPostureEventId(Long postureEventId);
}
