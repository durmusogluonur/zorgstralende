'use client';

import { useState } from 'react';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import CTAButton from '@/components/CTAButton';
import CTASection from '@/components/CTASection';

export default function AboutPage() {
  const [lang, setLang] = useState<Language>('nl');
  const t = getTranslation(lang);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {t.about.hero.title}
            </h1>
            <p className="text-2xl md:text-3xl text-primary-600 font-semibold">
              {t.about.hero.subtitle}
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                  <span className="text-8xl">💙</span>
                </div>
              </div>
            </MotionWrapper>
            
            <MotionWrapper delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t.about.story.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t.about.story.content}
              </p>
              <CTAButton href="/services" variant="secondary">
                {t.about.cta.buttonSecondary}
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
              {t.about.mission.title}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {t.about.mission.content}
            </p>
            <CTAButton href="/contact" variant="primary">
              {t.about.cta.button}
            </CTAButton>
          </MotionWrapper>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.about.values.title}
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.about.values.items.map((value, index) => (
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

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ons Team
            </h2>
            <p className="text-xl text-gray-600">
              {lang === 'nl' 
                ? 'Onze toegewijde zorgverleners staan voor u klaar'
                : 'Our dedicated caregivers are ready for you'}
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <MotionWrapper key={item} delay={index * 0.2}>
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                    <span className="text-5xl">👨‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {lang === 'nl' ? 'Zorgverlener' : 'Caregiver'} {item}
                  </h3>
                  <p className="text-gray-600">
                    {lang === 'nl' 
                      ? 'Ervaren en toegewijd'
                      : 'Experienced and dedicated'}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t.about.cta.title}
        description={t.about.cta.description}
        primaryButton={{
          text: t.about.cta.button,
          href: '/contact',
        }}
        secondaryButton={{
          text: t.about.cta.buttonSecondary,
          href: '/services',
        }}
      />
    </div>
  );
}
