import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/lib/mock-data';
import { Project } from '@/lib/types';
import { PlusCircle, Search, Clock, CheckCircle2, PlayCircle, FileVideo } from 'lucide-react';

const DashboardPageKo = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Force Korean language for this component
  if (i18n.language !== 'ko') {
    i18n.changeLanguage('ko');
  }
  
  // Sort and filter projects
  let filteredProjects = [...mockProjects];
  
  if (searchTerm) {
    filteredProjects = filteredProjects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  filteredProjects.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Helper function to get status badge
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'created':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{t('dashboard.status.created')}</Badge>;
      case 'uploading':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('dashboard.status.uploading')}</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{t('dashboard.status.processing')}</Badge>;
      case 'analyzed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">{t('dashboard.status.analyzed')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t('dashboard.status.completed')}</Badge>;
      default:
        return null;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'created':
        return <FileVideo className="h-5 w-5 text-gray-500" />;
      case 'uploading':
        return <FileVideo className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'analyzed':
        return <PlayCircle className="h-5 w-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 w-full sm:w-72"
            placeholder={t('dashboard.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">{t('dashboard.sort_newest')}</option>
            <option value="oldest">{t('dashboard.sort_oldest')}</option>
          </select>
          
          <Link to="/app/projects/new" className="ml-auto sm:ml-0">
            <Button className="whitespace-nowrap">
              <PlusCircle size={18} className="mr-2" />
              {t('dashboard.new_project')}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Projects grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileVideo className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.no_projects')}</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? '다른 검색어를 시도해보세요' : t('dashboard.no_projects_description')}
          </p>
          <Link to="/app/projects/new">
            <Button>
              <PlusCircle size={18} className="mr-2" />
              {t('dashboard.new_project')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl truncate">{project.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {formatDate(project.createdAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {project.audience.charAt(0).toUpperCase() + project.audience.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {project.formality}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    {getStatusIcon(project.status)}
                    <span className="ml-2 capitalize">{t(`dashboard.status.${project.status}`)}</span>
                  </div>
                  <Link to={`/app/projects/${project.id}/overview`}>
                    <Button size="sm" variant="outline">
                      {t('common.view')}
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPageKo;
