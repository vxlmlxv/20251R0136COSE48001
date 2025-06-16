/**
 * Video Thumbnail Extraction Utility
 * Provides functions to extract thumbnails from video at specific timestamps
 */

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ThumbnailResult {
  dataUrl: string;
  blob: Blob;
  timestamp: number;
}

export class VideoThumbnailExtractor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = context;
  }

  /**
   * Extract thumbnail at specific timestamp
   */
  async extractThumbnail(
    timestamp: number,
    options: ThumbnailOptions = {}
  ): Promise<ThumbnailResult> {
    const {
      width = 320,
      height = 180,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const originalTime = this.video.currentTime;
      
      const onSeeked = () => {
        try {
          // Set canvas dimensions
          this.canvas.width = width;
          this.canvas.height = height;

          // Draw video frame to canvas
          this.ctx.drawImage(this.video, 0, 0, width, height);

          // Get data URL
          const dataUrl = this.canvas.toDataURL(`image/${format}`, quality);

          // Convert to blob
          this.canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  dataUrl,
                  blob,
                  timestamp
                });
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            `image/${format}`,
            quality
          );

          // Restore original time
          this.video.currentTime = originalTime;
          this.video.removeEventListener('seeked', onSeeked);
        } catch (error) {
          this.video.removeEventListener('seeked', onSeeked);
          reject(error);
        }
      };

      this.video.addEventListener('seeked', onSeeked);
      this.video.currentTime = timestamp;
    });
  }

  /**
   * Extract multiple thumbnails at different timestamps
   */
  async extractMultipleThumbnails(
    timestamps: number[],
    options: ThumbnailOptions = {}
  ): Promise<ThumbnailResult[]> {
    const results: ThumbnailResult[] = [];
    
    for (const timestamp of timestamps) {
      try {
        const thumbnail = await this.extractThumbnail(timestamp, options);
        results.push(thumbnail);
      } catch (error) {
        console.error(`Failed to extract thumbnail at ${timestamp}s:`, error);
      }
    }
    
    return results;
  }

  /**
   * Extract thumbnails at regular intervals
   */
  async extractThumbnailGrid(
    intervalSeconds: number = 10,
    options: ThumbnailOptions = {}
  ): Promise<ThumbnailResult[]> {
    const duration = this.video.duration;
    const timestamps: number[] = [];
    
    for (let time = 0; time < duration; time += intervalSeconds) {
      timestamps.push(time);
    }
    
    return this.extractMultipleThumbnails(timestamps, options);
  }

  /**
   * Extract key moment thumbnails based on events
   */
  async extractKeyMomentThumbnails(
    events: Array<{ start: number; end?: number; id: string }>,
    options: ThumbnailOptions = {}
  ): Promise<Map<string, ThumbnailResult>> {
    const thumbnailMap = new Map<string, ThumbnailResult>();
    
    for (const event of events) {
      try {
        // Use start time or middle of event if end time is provided
        const timestamp = event.end 
          ? (event.start + event.end) / 2 
          : event.start;
          
        const thumbnail = await this.extractThumbnail(timestamp, options);
        thumbnailMap.set(event.id, thumbnail);
      } catch (error) {
        console.error(`Failed to extract thumbnail for event ${event.id}:`, error);
      }
    }
    
    return thumbnailMap;
  }
}

/**
 * Hook for video thumbnail extraction
 */
export const useVideoThumbnails = (videoElement: HTMLVideoElement | null) => {
  const extractThumbnail = async (
    timestamp: number,
    options?: ThumbnailOptions
  ): Promise<ThumbnailResult | null> => {
    if (!videoElement) return null;
    
    try {
      const extractor = new VideoThumbnailExtractor(videoElement);
      return await extractor.extractThumbnail(timestamp, options);
    } catch (error) {
      console.error('Failed to extract thumbnail:', error);
      return null;
    }
  };

  const extractMultipleThumbnails = async (
    timestamps: number[],
    options?: ThumbnailOptions
  ): Promise<ThumbnailResult[]> => {
    if (!videoElement) return [];
    
    try {
      const extractor = new VideoThumbnailExtractor(videoElement);
      return await extractor.extractMultipleThumbnails(timestamps, options);
    } catch (error) {
      console.error('Failed to extract multiple thumbnails:', error);
      return [];
    }
  };

  const extractKeyMomentThumbnails = async (
    events: Array<{ start: number; end?: number; id: string }>,
    options?: ThumbnailOptions
  ): Promise<Map<string, ThumbnailResult>> => {
    if (!videoElement) return new Map();
    
    try {
      const extractor = new VideoThumbnailExtractor(videoElement);
      return await extractor.extractKeyMomentThumbnails(events, options);
    } catch (error) {
      console.error('Failed to extract key moment thumbnails:', error);
      return new Map();
    }
  };

  return {
    extractThumbnail,
    extractMultipleThumbnails,
    extractKeyMomentThumbnails
  };
};
