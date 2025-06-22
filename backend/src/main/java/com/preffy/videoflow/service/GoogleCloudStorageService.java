package com.preffy.videoflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class GoogleCloudStorageService {

    @Value("${app.storage.type:local}")
    private String storageType;

    @Value("${app.storage.local.path:${user.home}/preffy-uploads}")
    private String localStoragePath;

    @Value("${app.storage.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Upload file to storage (local for now, can be extended to GCS)
     * @param file MultipartFile to upload
     * @param folder Folder name in the storage
     * @return Public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if ("gcs".equalsIgnoreCase(storageType)) {
            return uploadToGoogleCloudStorage(file, folder);
        } else {
            return uploadToLocalStorage(file, folder);
        }
    }

    /**
     * Upload to local storage
     */
    private String uploadToLocalStorage(MultipartFile file, String folder) throws IOException {
        // Create directory if it doesn't exist
        Path uploadDir = Paths.get(localStoragePath, folder);
        Files.createDirectories(uploadDir);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return public URL
        return String.format("%s/api/videos/stream/%s", baseUrl, filename);
    }

    /**
     * Upload to Google Cloud Storage (placeholder for future implementation)
     */
    private String uploadToGoogleCloudStorage(MultipartFile file, String folder) throws IOException {
        // TODO: Implement Google Cloud Storage upload when GCS dependencies are available
        // For now, fall back to local storage
        System.out.println("GCS not configured, falling back to local storage");
        return uploadToLocalStorage(file, folder);
    }

    /**
     * Delete file from storage
     * @param fileUrl Public URL of the file to delete
     * @return true if deleted successfully
     */
    public boolean deleteFile(String fileUrl) {
        try {
            if ("gcs".equalsIgnoreCase(storageType)) {
                return deleteFromGoogleCloudStorage(fileUrl);
            } else {
                return deleteFromLocalStorage(fileUrl);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Delete from local storage
     */
    private boolean deleteFromLocalStorage(String fileUrl) {
        try {
            // Extract filename from URL
            String filename = extractFilenameFromUrl(fileUrl);
            if (filename == null) return false;

            Path filePath = Paths.get(localStoragePath, "videos", filename);
            return Files.deleteIfExists(filePath);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Delete from Google Cloud Storage (placeholder)
     */
    private boolean deleteFromGoogleCloudStorage(String fileUrl) {
        // TODO: Implement GCS deletion
        return false;
    }

    /**
     * Check if file exists
     * @param fileUrl Public URL of the file
     * @return true if file exists
     */
    public boolean fileExists(String fileUrl) {
        try {
            if ("gcs".equalsIgnoreCase(storageType)) {
                return false; // TODO: Implement GCS file existence check
            } else {
                String filename = extractFilenameFromUrl(fileUrl);
                if (filename == null) return false;
                
                Path filePath = Paths.get(localStoragePath, "videos", filename);
                return Files.exists(filePath);
            }
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract filename from URL
     */
    private String extractFilenameFromUrl(String fileUrl) {
        try {
            // For local storage: http://localhost:8080/api/videos/stream/filename.ext
            if (fileUrl.contains("/stream/")) {
                return fileUrl.substring(fileUrl.lastIndexOf("/stream/") + 8);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Initialize storage
     */
    public void initializeStorage() {
        try {
            if ("local".equalsIgnoreCase(storageType)) {
                // Create local storage directories
                Path uploadDir = Paths.get(localStoragePath, "videos");
                Files.createDirectories(uploadDir);
                System.out.println("Local storage initialized at: " + uploadDir.toAbsolutePath());
            } else if ("gcs".equalsIgnoreCase(storageType)) {
                // TODO: Initialize GCS bucket
                System.out.println("GCS storage initialization not implemented yet");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize storage: " + e.getMessage());
        }
    }
}
