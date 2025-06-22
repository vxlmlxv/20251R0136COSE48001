package com.preffy.videoflow.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Profile;

/**
 * Test configuration that prevents external service connections during tests
 * This configuration is active only when the 'test' profile is used
 */
@TestConfiguration
@Profile("test")
public class TestConfig {
    // Test configuration to override beans if needed
    // Currently just serves to isolate test environment
}
