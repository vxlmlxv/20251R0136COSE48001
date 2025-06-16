package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.ScriptSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScriptSegmentRepository extends JpaRepository<ScriptSegment, Long> {
    List<ScriptSegment> findByProjectIdOrderByStartTime(Long projectId);
}
