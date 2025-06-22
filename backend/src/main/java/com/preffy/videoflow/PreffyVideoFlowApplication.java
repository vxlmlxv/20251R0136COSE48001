package com.preffy.videoflow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

@SpringBootApplication
public class PreffyVideoFlowApplication {

	private static final Logger logger = LoggerFactory.getLogger(PreffyVideoFlowApplication.class);

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(PreffyVideoFlowApplication.class);
		Environment env = app.run(args).getEnvironment();
		
		logApplicationStartup(env);
	}

	private static void logApplicationStartup(Environment env) {
		String protocol = "http";
		if (env.getProperty("server.ssl.key-store") != null) {
			protocol = "https";
		}
		String serverPort = env.getProperty("server.port");
		String contextPath = env.getProperty("server.servlet.context-path", "");
		String hostAddress = "localhost";
		try {
			hostAddress = InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			logger.warn("The host name could not be determined, using `localhost` as fallback");
		}
		
		logger.info("""
			----------------------------------------------------------
			Application '{}' is running! Access URLs:
			Local: 		{}://localhost:{}{}
			External: 	{}://{}:{}{}
			Profile(s): 	{}
			----------------------------------------------------------""",
			env.getProperty("spring.application.name"),
			protocol,
			serverPort,
			contextPath,
			protocol,
			hostAddress,
			serverPort,
			contextPath,
			env.getActiveProfiles().length == 0 ? env.getDefaultProfiles() : env.getActiveProfiles()
		);
	}

	@Bean
	public ApplicationRunner applicationStartupRunner() {
		return new ApplicationRunner() {
			@Override
			public void run(ApplicationArguments args) {
				logger.info("PreffyVideoFlow application started successfully with arguments: {}", args.getOptionNames());
				logger.info("Available processors: {}", Runtime.getRuntime().availableProcessors());
				logger.info("Max memory: {} MB", Runtime.getRuntime().maxMemory() / 1024 / 1024);
				logger.info("Total memory: {} MB", Runtime.getRuntime().totalMemory() / 1024 / 1024);
				logger.info("Free memory: {} MB", Runtime.getRuntime().freeMemory() / 1024 / 1024);
			}
		};
	}
}
