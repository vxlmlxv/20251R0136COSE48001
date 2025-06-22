import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserIcon } from 'lucide-react';

const ProfilePageKo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      toast({
        title: '프로필이 업데이트되었습니다',
        description: '프로필이 성공적으로 업데이트되었습니다.',
        variant: 'default',
      });
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
      
      <div className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 사진</CardTitle>
            <CardDescription>
              계정과 프로젝트에 표시될 사진입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || undefined} alt={name} />
                <AvatarFallback className="text-2xl">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('avatar')?.click()}
                >
                  사진 변경
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, GIF 또는 PNG. 최대 크기 800K.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>개인 정보</CardTitle>
            <CardDescription>
              개인 세부사항을 업데이트하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">전체 이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">
                취소
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? '저장 중...' : '변경사항 저장'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호</CardTitle>
            <CardDescription>
              비밀번호를 변경하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">현재 비밀번호</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="새 비밀번호를 확인하세요"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">
              비밀번호 업데이트
            </Button>
          </CardFooter>
        </Card>
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>계정 설정</CardTitle>
            <CardDescription>
              계정 기본 설정을 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">이메일 알림</h3>
                <p className="text-sm text-gray-500">
                  프로젝트에 대한 이메일 업데이트를 받습니다
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="email-notifications" className="sr-only">이메일 알림</Label>
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="h-4 w-4 rounded border-gray-300 text-mint focus:ring-mint"
                  defaultChecked
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600">계정 삭제</h3>
                  <p className="text-sm text-gray-500">
                    계정과 모든 데이터를 영구적으로 삭제합니다
                  </p>
                </div>
                <Button variant="destructive">
                  계정 삭제
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePageKo;
