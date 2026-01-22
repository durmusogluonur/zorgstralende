import { Language } from '@/lib/translations';

export interface Service {
  id: string;
  slug: string;
  title: {
    nl: string;
    en: string;
  };
  description: {
    nl: string;
    en: string;
  };
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
