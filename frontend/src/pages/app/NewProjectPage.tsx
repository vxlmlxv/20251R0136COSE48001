import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Upload, Check, FileVideo } from 'lucide-react';

const NewProjectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Wizard steps
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Project details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState<'general' | 'knowledgeable' | 'expert'>('general');
  const [formality, setFormality] = useState<'informal' | 'neutral' | 'formal'>('neutral');
  const [domain, setDomain] = useState('');
  
  // Video upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form validation
  const isStep1Valid = () => title.trim() !== '' && description.trim() !== '';
  const isStep2Valid = () => true; // Since audience and formality have default values, this step is always valid
  const isStep3Valid = () => selectedFile !== null;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleNext = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      setStep(3);
    }
  };
  
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const handleSubmit = () => {
    if (!isStep3Valid()) return;
    
    setIsSubmitting(true);
    
    // Simulate upload process
    simulateUpload();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Project created successfully',
        description: 'Your project has been created and is now being processed.',
        variant: 'default',
      });
      
      setIsSubmitting(false);
      
      // Simulate waiting for backend processing
      setTimeout(() => {
        // Navigate to the new project (using a mock ID for demo purposes)
        navigate('/app/projects/project-new/overview');
      }, 1000);
    }, 5000); // 5 seconds to simulate upload completion
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500">Step {step} of 3</div>
          <div className="text-sm text-gray-500">
            {step === 1 ? 'Basic Info' : step === 2 ? 'Audience & Context' : 'Upload Video'}
          </div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-mint transition-all duration-300 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Card className="w-full">
        {/* Step 1: Project Details */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Enter the basic information about your presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="required">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="required">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your presentation is about"
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                onClick={handleNext} 
                disabled={!isStep1Valid()}
              >
                Next Step
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </>
        )}
        
        {/* Step 2: Audience & Context */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Audience & Context</CardTitle>
              <CardDescription>
                Tell us more about your target audience and presentation context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="audience" className="required">Target Audience</Label>
                <RadioGroup value={audience} onValueChange={(value) => setAudience(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="audience-general" />
                    <Label htmlFor="audience-general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="audience-technical" />
                    <Label htmlFor="audience-technical">Technical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="audience-executive" />
                    <Label htmlFor="audience-executive">Executive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="audience-academic" />
                    <Label htmlFor="audience-academic">Academic</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="formality" className="required">Presentation Formality</Label>
                <RadioGroup value={formality} onValueChange={(value) => setFormality(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="formality-casual" />
                    <Label htmlFor="formality-casual">Casual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="formality-neutral" />
                    <Label htmlFor="formality-neutral">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formality-formal" />
                    <Label htmlFor="formality-formal">Formal</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domain or Industry</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isStep2Valid()}>
                Next Step
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </>
        )}
        
        {/* Step 3: Video Upload */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Upload Your Video</CardTitle>
              <CardDescription>
                Upload the video recording of your presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop your video file here, or click to browse</p>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('video-upload')?.click()}>
                    <Upload size={18} className="mr-2" />
                    Select Video
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: MP4, MOV, AVI, MKV. Max file size: 500MB.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-mint/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-mint" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium">{selectedFile.name}</div>
                      <div className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                      Change
                    </Button>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isStep3Valid() || isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? 'Processing...' : 'Create Project'}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default NewProjectPage;
