package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.BadgeScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeScoreRepository extends JpaRepository<BadgeScore, Long> {
    List<BadgeScore> findByProjectId(Long projectId);
}
