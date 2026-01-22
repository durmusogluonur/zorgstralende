'use client';

import { useState } from 'react';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import CTAButton from '@/components/CTAButton';
import CTASection from '@/components/CTASection';

export default function BegeleidingPage() {
  const [lang, setLang] = useState<Language>('nl');
  const t = getTranslation(lang);
  const service = t.services.begeleiding;

  // Placeholder images - will be replaced with real photos
  const galleryImages = [
    '/images/services/begeleiding/1.jpg',
    '/images/services/begeleiding/2.jpg',
    '/images/services/begeleiding/3.jpg',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <MotionWrapper>
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                  <span className="text-8xl">🤝</span>
                </div>
              </div>
            </MotionWrapper>
            
            <MotionWrapper delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {service.hero.title}
              </h1>
              <p className="text-2xl text-primary-600 mb-6 font-semibold">
                {service.hero.subtitle}
              </p>
              <CTAButton href="/contact" variant="primary" className="text-lg px-8 py-4">
                {service.cta.button}
              </CTAButton>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <MotionWrapper className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {lang === 'nl' ? 'Over deze dienst' : 'About this service'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {service.description}
            </p>
            <CTAButton href="/services" variant="outline">
              {service.cta.buttonSecondary}
            </CTAButton>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {lang === 'nl' ? 'Wat bieden wij?' : 'What we offer'}
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {service.features.map((feature, index) => (
              <MotionWrapper key={feature} delay={index * 0.1}>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">✓</div>
                    <p className="text-lg text-gray-700">{feature}</p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {lang === 'nl' ? 'Foto\'s' : 'Photos'}
            </h2>
            <p className="text-xl text-gray-600">
              {lang === 'nl' 
                ? 'Een kijkje in onze begeleidingsdiensten'
                : 'A look at our guidance services'}
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <MotionWrapper key={index} delay={index * 0.1}>
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                    <span className="text-6xl">📷</span>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={service.cta.title}
        primaryButton={{
          text: service.cta.button,
          href: '/contact',
        }}
        secondaryButton={{
          text: service.cta.buttonSecondary,
          href: '/services',
        }}
      />
    </div>
  );
}
