package com.preffy.videoflow.controller;

import com.preffy.videoflow.entity.ScriptAnalysis;
import com.preffy.videoflow.service.ScriptAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/script-analysis")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Script Analysis", description = "Script feedback and analysis endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ScriptAnalysisController {
    
    private static final Logger logger = LoggerFactory.getLogger(ScriptAnalysisController.class);
    
    @Autowired
    private ScriptAnalysisService scriptAnalysisService;
    
    @GetMapping("/project/{projectId}")
    @Operation(
        summary = "Get Script Analysis by Project ID",
        description = "Retrieve script analysis results for a specific project"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Script analysis found"),
        @ApiResponse(responseCode = "404", description = "Script analysis not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ScriptAnalysis> getAnalysisByProjectId(
        @Parameter(description = "Project ID") @PathVariable Long projectId
    ) {
        logger.info("Getting script analysis for project: {}", projectId);
        
        Optional<ScriptAnalysis> analysis = scriptAnalysisService.getAnalysisByProjectId(projectId);
        
        if (analysis.isPresent()) {
            return ResponseEntity.ok(analysis.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/all")
    @Operation(
        summary = "Get All Script Analyses",
        description = "Retrieve all script analysis results"
    )
    @ApiResponse(responseCode = "200", description = "All script analyses retrieved")
    public ResponseEntity<Iterable<ScriptAnalysis>> getAllAnalyses() {
        logger.info("Getting all script analyses");
        
        Iterable<ScriptAnalysis> analyses = scriptAnalysisService.getAllAnalyses();
        return ResponseEntity.ok(analyses);
    }
}
