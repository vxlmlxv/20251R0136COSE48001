package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.PostureEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostureEventRepository extends JpaRepository<PostureEvent, Long> {
    List<PostureEvent> findByProjectIdOrderByCreatedAt(Long projectId);
}
