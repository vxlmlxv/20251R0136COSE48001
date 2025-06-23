/**
 * Video Thumbnail Generator Utility
 * Generates thumbnails from video files at specific timestamps
 */

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface Thumbnail {
  timestamp: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export class VideoThumbnailGenerator {
  private videoElement: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.videoElement = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    
    // Configure video element for thumbnail generation
    this.videoElement.crossOrigin = 'anonymous';
    this.videoElement.preload = 'metadata';
    this.videoElement.muted = true;
  }

  /**
   * Generate a single thumbnail at a specific timestamp
   */
  async generateThumbnail(
    videoUrl: string, 
    timestamp: number, 
    options: ThumbnailOptions = {}
  ): Promise<Thumbnail> {
    const {
      width = 160,
      height = 90,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const onLoadedMetadata = () => {
        this.videoElement.currentTime = timestamp;
      };

      const onSeeked = () => {
        try {
          // Set canvas dimensions
          this.canvas.width = width;
          this.canvas.height = height;

          // Calculate aspect ratio preserving dimensions
          const videoAspect = this.videoElement.videoWidth / this.videoElement.videoHeight;
          const canvasAspect = width / height;

          let drawWidth = width;
          let drawHeight = height;
          let offsetX = 0;
          let offsetY = 0;

          if (videoAspect > canvasAspect) {
            // Video is wider, fit to height
            drawHeight = height;
            drawWidth = height * videoAspect;
            offsetX = (width - drawWidth) / 2;
          } else {
            // Video is taller, fit to width
            drawWidth = width;
            drawHeight = width / videoAspect;
            offsetY = (height - drawHeight) / 2;
          }

          // Clear canvas with black background
          this.context.fillStyle = '#000000';
          this.context.fillRect(0, 0, width, height);

          // Draw video frame
          this.context.drawImage(
            this.videoElement,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight
          );

          // Convert to blob and data URL
          this.canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to generate thumbnail blob'));
              return;
            }

            const dataUrl = this.canvas.toDataURL(`image/${format}`, quality);
            
            resolve({
              timestamp,
              dataUrl,
              blob,
              width,
              height
            });

            // Cleanup
            this.cleanup();
          }, `image/${format}`, quality);

        } catch (error) {
          reject(error);
        }
      };

      const onError = () => {
        reject(new Error('Failed to load video for thumbnail generation'));
        this.cleanup();
      };

      // Set up event listeners
      this.videoElement.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
      this.videoElement.addEventListener('seeked', onSeeked, { once: true });
      this.videoElement.addEventListener('error', onError, { once: true });

      // Load video
      this.videoElement.src = videoUrl;
      this.videoElement.load();
    });
  }

  /**
   * Generate multiple thumbnails at different timestamps
   */
  async generateThumbnails(
    videoUrl: string,
    timestamps: number[],
    options: ThumbnailOptions = {}
  ): Promise<Thumbnail[]> {
    const thumbnails: Thumbnail[] = [];
    
    for (const timestamp of timestamps) {
      try {
        const thumbnail = await this.generateThumbnail(videoUrl, timestamp, options);
        thumbnails.push(thumbnail);
      } catch (error) {
        console.error(`Failed to generate thumbnail at ${timestamp}s:`, error);
      }
    }
    
    return thumbnails;
  }

  /**
   * Generate thumbnails at regular intervals
   */
  async generateIntervalThumbnails(
    videoUrl: string,
    duration: number,
    count: number = 10,
    options: ThumbnailOptions = {}
  ): Promise<Thumbnail[]> {
    const interval = duration / (count + 1);
    const timestamps = Array.from({ length: count }, (_, i) => (i + 1) * interval);
    
    return this.generateThumbnails(videoUrl, timestamps, options);
  }

  /**
   * Generate thumbnails for key moments (events)
   */
  async generateEventThumbnails(
    videoUrl: string,
    events: Array<{ timestamp: number; id: string }>,
    options: ThumbnailOptions = {}
  ): Promise<Map<string, Thumbnail>> {
    const thumbnailMap = new Map<string, Thumbnail>();
    
    for (const event of events) {
      try {
        const thumbnail = await this.generateThumbnail(videoUrl, event.timestamp, options);
        thumbnailMap.set(event.id, thumbnail);
      } catch (error) {
        console.error(`Failed to generate thumbnail for event ${event.id}:`, error);
      }
    }
    
    return thumbnailMap;
  }

  /**
   * Clean up resources
   */
  private cleanup() {
    this.videoElement.removeAttribute('src');
    this.videoElement.load();
  }

  /**
   * Dispose of the generator and clean up resources
   */
  dispose() {
    this.cleanup();
    this.videoElement.remove();
    this.canvas.remove();
  }
}

/**
 * Convenience function to generate a single thumbnail
 */
export async function generateVideoThumbnail(
  videoUrl: string,
  timestamp: number,
  options?: ThumbnailOptions
): Promise<Thumbnail> {
  const generator = new VideoThumbnailGenerator();
  try {
    return await generator.generateThumbnail(videoUrl, timestamp, options);
  } finally {
    generator.dispose();
  }
}

/**
 * Convenience function to generate multiple thumbnails
 */
export async function generateVideoThumbnails(
  videoUrl: string,
  timestamps: number[],
  options?: ThumbnailOptions
): Promise<Thumbnail[]> {
  const generator = new VideoThumbnailGenerator();
  try {
    return await generator.generateThumbnails(videoUrl, timestamps, options);
  } finally {
    generator.dispose();
  }
}
