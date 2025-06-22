package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    List<Video> findByProjectId(String projectId);
    
    Optional<Video> findByProjectIdAndFilename(String projectId, String filename);
    
    Optional<Video> findFirstByProjectIdOrderByCreatedAtDesc(String projectId);
}
