'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import CTAButton from '@/components/CTAButton';
import CTASection from '@/components/CTASection';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse rounded-xl bg-gray-100 h-96 w-full" aria-hidden />
  ),
});

export default function ContactPage() {
  const [lang, setLang] = useState<Language>('nl');
  const t = getTranslation(lang);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {t.contact.hero.title}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600">
              {t.contact.hero.subtitle}
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <MotionWrapper>
              <ContactForm lang={lang} />
            </MotionWrapper>

            {/* Contact Information */}
            <MotionWrapper delay={0.2}>
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl shadow-lg p-8 h-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t.contact.info.title}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {t.contact.info.address}
                    </h3>
                    <p className="text-gray-600">
                      Middellaan 33G<br />
                      5102PB Dongen<br />
                      Nederland
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {t.contact.info.phone}
                    </h3>
                    <p className="text-gray-600">
                      <a href="tel:+31850603854" className="hover:text-primary-600 transition-colors">
                        +31 85 060 3854
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {t.contact.info.email}
                    </h3>
                    <p className="text-gray-600">
                      info@stralendezorg.nl
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-300">
                  <p className="text-gray-600 mb-4">
                    {lang === 'nl'
                      ? 'Wij zijn bereikbaar van maandag tot vrijdag van 9:00 tot 17:00.'
                      : 'We are available Monday to Friday from 9:00 to 17:00.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CTAButton href="/services" variant="outline" className="flex-1">
                      {t.contact.cta.button}
                    </CTAButton>
                    <CTAButton href="/about" variant="outline" className="flex-1">
                      {t.contact.cta.buttonSecondary}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t.contact.cta.title}
        primaryButton={{
          text: t.contact.cta.button,
          href: '/services',
        }}
        secondaryButton={{
          text: t.contact.cta.buttonSecondary,
          href: '/about',
        }}
      />
    </div>
  );
}
