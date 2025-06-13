package com.preffy.videoflow.repository;

import com.preffy.videoflow.model.Project;
import com.preffy.videoflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
    List<Project> findByUserOrderByCreatedAtDesc(User user);
}
