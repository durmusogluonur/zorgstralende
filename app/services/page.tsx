'use client';

import { useState } from 'react';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';

export default function ServicesPage() {
  const [lang, setLang] = useState<Language>('nl');
  const t = getTranslation(lang);

  const services = [
    {
      title: t.services.persoonlijkeVerzorging.title,
      description: t.services.persoonlijkeVerzorging.description,
      href: '/services/persoonlijke-verzorging',
      icon: '🛁',
    },
    {
      title: t.services.begeleiding.title,
      description: t.services.begeleiding.description,
      href: '/services/begeleiding',
      icon: '🤝',
    },
    {
      title: t.services.huishoudelijkeHulp.title,
      description: t.services.huishoudelijkeHulp.description,
      href: '/services/huishoudelijke-hulp',
      icon: '🏠',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {t.services.title}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600">
              {t.services.subtitle}
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.href}
                title={service.title}
                description={service.description}
                href={service.href}
                icon={service.icon}
                delay={index * 0.2}
                ctaText={t.services.overview.cta}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t.services.cta.title}
        description={t.services.cta.description}
        primaryButton={{
          text: t.services.cta.button,
          href: '/contact',
        }}
      />
    </div>
  );
}
