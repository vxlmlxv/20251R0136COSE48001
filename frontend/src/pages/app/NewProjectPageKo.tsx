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

const NewProjectPageKo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Wizard steps
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Project details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState<'general' | 'technical' | 'executive' | 'academic'>('general');
  const [formality, setFormality] = useState<'casual' | 'neutral' | 'formal'>('neutral');
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
        title: '프로젝트가 성공적으로 생성되었습니다',
        description: '프로젝트가 생성되었으며 현재 처리 중입니다.',
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

  // Helper functions for Korean labels
  const getAudienceKo = (value: string) => {
    switch (value) {
      case 'general': return '일반';
      case 'technical': return '기술적';
      case 'executive': return '경영진';
      case 'academic': return '학술';
      default: return value;
    }
  };

  const getFormalityKo = (value: string) => {
    switch (value) {
      case 'casual': return '캐주얼';
      case 'neutral': return '중립';
      case 'formal': return '격식';
      default: return value;
    }
  };

  const getDomainKo = (value: string) => {
    switch (value) {
      case 'sales': return '영업';
      case 'marketing': return '마케팅';
      case 'technology': return '기술';
      case 'education': return '교육';
      case 'healthcare': return '의료';
      case 'finance': return '금융';
      case 'other': return '기타';
      default: return value;
    }
  };

  const getStepNameKo = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return '기본 정보';
      case 2: return '청중 및 맥락';
      case 3: return '동영상 업로드';
      default: return '';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500">단계 {step} / 3</div>
          <div className="text-sm text-gray-500">
            {getStepNameKo(step)}
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
              <CardTitle>프로젝트 세부사항</CardTitle>
              <CardDescription>
                프레젠테이션에 대한 기본 정보를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="required">프로젝트 제목</Label>
                <Input
                  id="title"
                  placeholder="프로젝트 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="required">설명</Label>
                <Textarea
                  id="description"
                  placeholder="프레젠테이션의 내용을 설명하세요"
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
                다음 단계
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </>
        )}
        
        {/* Step 2: Audience & Context */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>청중 및 맥락</CardTitle>
              <CardDescription>
                대상 청중과 프레젠테이션 맥락에 대해 알려주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="audience" className="required">대상 청중</Label>
                <p className="text-sm text-gray-600">주요 청중은 누구인가요?</p>
                <RadioGroup value={audience} onValueChange={(value) => setAudience(value as 'general' | 'technical' | 'executive' | 'academic')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="audience-general" />
                    <Label htmlFor="audience-general">일반</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="audience-technical" />
                    <Label htmlFor="audience-technical">기술적</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="audience-executive" />
                    <Label htmlFor="audience-executive">경영진</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="audience-academic" />
                    <Label htmlFor="audience-academic">학술</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="formality" className="required">격식성 수준</Label>
                <p className="text-sm text-gray-600">프레젠테이션의 어조는 어떠해야 하나요?</p>
                <RadioGroup value={formality} onValueChange={(value) => setFormality(value as 'casual' | 'neutral' | 'formal')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="formality-casual" />
                    <Label htmlFor="formality-casual">캐주얼</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="formality-neutral" />
                    <Label htmlFor="formality-neutral">중립</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formality-formal" />
                    <Label htmlFor="formality-formal">격식</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">분야 또는 산업 (선택사항)</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="분야를 선택하세요 (선택사항)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">영업</SelectItem>
                    <SelectItem value="marketing">마케팅</SelectItem>
                    <SelectItem value="technology">기술</SelectItem>
                    <SelectItem value="education">교육</SelectItem>
                    <SelectItem value="healthcare">의료</SelectItem>
                    <SelectItem value="finance">금융</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                이전
              </Button>
              <Button onClick={handleNext} disabled={!isStep2Valid()}>
                다음 단계
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </>
        )}
        
        {/* Step 3: Video Upload */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>동영상 업로드</CardTitle>
              <CardDescription>
                프레젠테이션 녹화 동영상을 업로드하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">여기에 동영상 파일을 드래그하거나 클릭하여 찾아보세요</p>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('video-upload')?.click()}>
                    <Upload size={18} className="mr-2" />
                    동영상 선택
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    지원 형식: MP4, MOV, AVI, MKV. 최대 파일 크기: 500MB.
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
                      변경
                    </Button>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>업로드 중...</span>
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
                이전
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isStep3Valid() || isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? '처리 중...' : '프로젝트 생성'}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default NewProjectPageKo;
