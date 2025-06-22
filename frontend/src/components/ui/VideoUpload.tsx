import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadedVideo {
  id: number;
  projectId: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  storageUrl: string;
  duration: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt?: string;
}

interface VideoUploadProps {
  projectId: string;
  onUploadSuccess?: (video: UploadedVideo) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ projectId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid video file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please select a video file smaller than 100MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', projectId);

      const response = await fetch('http://localhost:8080/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const uploadedVideoData = await response.json();
      setUploadedVideo(uploadedVideoData);
      
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded successfully.",
      });

      if (onUploadSuccess) {
        onUploadSuccess(uploadedVideoData);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload video.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Video
        </CardTitle>
        <CardDescription>
          Upload a video file for body language analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedVideo ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="video-file">Select Video File</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>

            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <p><strong>File:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Upload Complete</p>
                <p className="text-xs text-green-600">Video is ready for analysis</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Original File:</strong> {uploadedVideo.originalFilename}</p>
                <p><strong>Duration:</strong> {uploadedVideo.duration} seconds</p>
                <p><strong>Resolution:</strong> {uploadedVideo.width}x{uploadedVideo.height}</p>
                <p><strong>Size:</strong> {formatFileSize(uploadedVideo.fileSize)}</p>
              </div>
            </div>

            <video 
              src={`http://localhost:8080${uploadedVideo.storageUrl}`}
              controls 
              className="w-full max-h-64 rounded-lg"
            >
              Your browser does not support the video tag.
            </video>

            <Button 
              onClick={() => {
                setUploadedVideo(null);
                setSelectedFile(null);
              }} 
              variant="outline"
              className="w-full"
            >
              Upload Another Video
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
