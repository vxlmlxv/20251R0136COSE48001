export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  locale: string;
  plan: 'free' | 'pro' | 'enterprise';
}
