package com.preffy.videoflow;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class PreffyVideoFlowApplicationTests {

	@BeforeAll
	static void setUp() {
		// Disable Google Cloud authentication attempts
		System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "");
		System.setProperty("gcp.project.id", "");
		System.setProperty("spring.cloud.gcp.credentials.location", "");
		System.setProperty("spring.cloud.gcp.project-id", "");
		
		// Set fake service account path to prevent automatic detection
		System.setProperty("GOOGLE_CLOUD_PROJECT", "");
		System.setProperty("GCLOUD_PROJECT", "");
	}

	@Test
	void contextLoads() {
		// This test verifies that the Spring application context loads successfully
		// with the test profile, using H2 in-memory database instead of Cloud SQL
		// and local storage instead of Google Cloud Storage
	}

}
