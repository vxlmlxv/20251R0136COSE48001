import { VideoThumbnailGenerator } from '../src/lib/thumbnail-generator';

async function testThumbnailGeneration() {
  const generator = new VideoThumbnailGenerator();
  
  try {
    console.log('Testing video thumbnail generation...');
    
    // Test single thumbnail generation
    const singleThumbnail = await generator.generateThumbnail(
      '/demo-videos/demo.mp4',
      30, // 30 seconds
      { width: 160, height: 90, quality: 0.8, format: 'jpeg' }
    );
    
    console.log('Single thumbnail generated:', singleThumbnail.timestamp);
    console.log('Data URL length:', singleThumbnail.dataUrl.length);
    
    // Test multiple thumbnails generation
    const timestamps = [10, 30, 60, 120, 180];
    const multipleThumbnails = await generator.generateThumbnails(
      '/demo-videos/demo.mp4',
      timestamps,
      { width: 120, height: 68, quality: 0.8, format: 'jpeg' }
    );
    
    console.log('Multiple thumbnails generated:', multipleThumbnails.length);
    multipleThumbnails.forEach((thumb, index) => {
      console.log(`Thumbnail ${index + 1}: ${thumb.timestamp}s`);
    });
    
    // Test event thumbnails generation
    const events = [
      { id: 'event1', timestamp: 45 },
      { id: 'event2', timestamp: 90 },
      { id: 'event3', timestamp: 150 }
    ];
    
    const eventThumbnails = await generator.generateEventThumbnails(
      '/demo-videos/demo.mp4',
      events,
      { width: 160, height: 90, quality: 0.8, format: 'jpeg' }
    );
    
    console.log('Event thumbnails generated:', eventThumbnails.size);
    eventThumbnails.forEach((thumb, id) => {
      console.log(`Event ${id}: ${thumb.timestamp}s`);
    });
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    generator.dispose();
  }
}

// Export for testing
export { testThumbnailGeneration };
