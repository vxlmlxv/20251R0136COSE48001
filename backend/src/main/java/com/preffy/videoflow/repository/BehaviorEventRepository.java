package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.BehaviorEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BehaviorEventRepository extends JpaRepository<BehaviorEvent, Long> {
    List<BehaviorEvent> findByProjectIdOrderByStartTime(Long projectId);
    List<BehaviorEvent> findByProjectIdAndEventTypeOrderByStartTime(Long projectId, BehaviorEvent.EventType eventType);
}
