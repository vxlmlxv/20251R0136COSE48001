import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { projectService } from '@/services/project-service';
import { toast } from '@/hooks/use-toast';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'form' | 'uploading' | 'processing' | 'complete'>('form');
  const [createdProject, setCreatedProject] = useState<{ id: string; title: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    audience: '',
    formality: '',
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a video file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select a video file smaller than 100MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: 'Video Required',
        description: 'Please select a video file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep('uploading');
    setUploadProgress(0);

    try {
      // Create project with video
      const project = await projectService.createProjectWithVideo(
        formData,
        videoFile,
        (progress) => {
          setUploadProgress(progress);
          if (progress >= 100) {
            setCurrentStep('processing');
          }
        }
      );

      setCreatedProject(project);
      setCurrentStep('complete');
      
      toast({
        title: 'Project Created Successfully',
        description: 'Your project has been created and analysis has started in the background.',
      });

      // Navigate to project overview after 3 seconds
      setTimeout(() => {
        navigate(`/app/projects/${project.id}/overview`);
      }, 3000);

    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error Creating Project',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
      setCurrentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show processing/completion status
  if (currentStep !== 'form') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentStep === 'uploading' && 'Uploading Video'}
              {currentStep === 'processing' && 'Processing Project'}
              {currentStep === 'complete' && 'Project Created Successfully!'}
            </CardTitle>
            <CardDescription>
              {currentStep === 'uploading' && 'Please wait while we upload your video...'}
              {currentStep === 'processing' && 'Setting up your project and starting analysis...'}
              {currentStep === 'complete' && 'Your project is ready and analysis is running in the background.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 'uploading' && (
              <div className="space-y-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-center text-sm text-gray-600">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
            
            {currentStep === 'processing' && (
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                <p className="text-sm text-gray-600">
                  Creating project and extracting audio for analysis...
                </p>
              </div>
            )}
            
            {currentStep === 'complete' && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">{createdProject?.title}</p>
                  <p className="text-sm text-gray-600">
                    Body language and script analysis are running in the background.
                    You'll be able to view the results on the feedback pages once they're complete.
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  Redirecting to project overview in a few seconds...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-gray-600">
          Upload your presentation video and get AI-powered feedback on your body language and script.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide basic information about your presentation project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Project Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Q3 Sales Presentation"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your presentation..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Select onValueChange={(value) => handleInputChange('domain', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">Audience</Label>
                  <Select onValueChange={(value) => handleInputChange('audience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="formality">Formality</Label>
                  <Select onValueChange={(value) => handleInputChange('formality', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select formality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Video Upload */}
            <div className="space-y-4">
              <Label>Presentation Video *</Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  {videoFile ? (
                    <div className="space-y-2">
                      <Video className="h-8 w-8 text-green-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-medium text-green-600">{videoFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(videoFile.size)}</p>
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        Change Video
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-gray-600">Click to upload your presentation video</p>
                        <p className="text-sm text-gray-500">MP4, MOV, AVI up to 100MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Analysis Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-900">What happens next?</h4>
                  <p className="text-sm text-blue-700">
                    After uploading your video, we'll automatically:
                  </p>
                  <ul className="text-sm text-blue-700 list-disc list-inside space-y-1 mt-2">
                    <li>Extract audio for script analysis</li>
                    <li>Analyze your body language and gestures</li>
                    <li>Provide feedback on your speech patterns</li>
                    <li>Generate improvement suggestions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !videoFile || !formData.title}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Project & Upload Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
