'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import CTAButton from '@/components/CTAButton';
import CTASection from '@/components/CTASection';

export default function AboutPage() {
  const [lang, setLang] = useState<Language>('nl');
  
  // Safely get translations with error handling
  const t = useMemo(() => {
    try {
      return getTranslation(lang);
    } catch (error) {
      console.error('Translation error:', error);
      // Return fallback translations
      return getTranslation('nl');
    }
  }, [lang]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {t?.about?.hero?.title || 'Over Ons'}
            </h1>
            <p className="text-2xl md:text-3xl text-primary-600 font-semibold">
              {t?.about?.hero?.subtitle || 'Meer dan alleen zorg'}
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <MotionWrapper>
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-story.jpg"
                  alt="Stralendezorg - Ons Verhaal"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  priority
                />
              </div>
            </MotionWrapper>
            
            <MotionWrapper delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t?.about?.story?.title || 'Ons Verhaal'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t?.about?.story?.content || 'Stralendezorg is een kleinschalige thuiszorg bedrijf dat de cliënt en de verzorgende graag in verbintenis wilt brengen.'}
              </p>
              <CTAButton href="/services" variant="secondary">
                {t?.about?.cta?.buttonSecondary || 'Bekijk Onze Diensten'}
              </CTAButton>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t?.about?.mission?.title || 'Onze Missie'}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {t?.about?.mission?.content || 'Stralendezorg is niet alleen gebaseerd om uiterlijke zorg maar ook innerlijk.'}
            </p>
            <CTAButton href="/contact" variant="primary">
              {t?.about?.cta?.button || 'Neem Contact Op'}
            </CTAButton>
          </MotionWrapper>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t?.about?.values?.title || 'Onze Waarden'}
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(t?.about?.values?.items || []).map((value, index) => (
              <MotionWrapper key={value.title} delay={index * 0.2}>
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl mb-4">
                    {index === 0 ? '👤' : index === 1 ? '🤝' : '❤️'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t?.about?.cta?.title || 'Klaar om te beginnen?'}
        description={t?.about?.cta?.description || 'Neem vandaag nog contact met ons op voor een vrijblijvend gesprek.'}
        primaryButton={{
          text: t?.about?.cta?.button || 'Neem Contact Op',
          href: '/contact',
        }}
        secondaryButton={{
          text: t?.about?.cta?.buttonSecondary || 'Bekijk Onze Diensten',
          href: '/services',
        }}
      />
    </div>
  );
}
