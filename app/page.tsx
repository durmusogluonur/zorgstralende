'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { getTranslation, Language } from '@/lib/translations';
import MotionWrapper from '@/components/MotionWrapper';
import ServiceCard from '@/components/ServiceCard';
import CTAButton from '@/components/CTAButton';
import CTASection from '@/components/CTASection';
import { motion } from 'framer-motion';

export default function Home() {
  const [lang] = useState<Language>('nl');
  
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

  // Safely get services with error handling
  const services: Array<{
    title: string;
    description: string;
    href: string;
    image: string;
    icon: string;
  }> = useMemo(() => {
    try {
      return [
        {
          title: t?.services?.persoonlijkeVerzorging?.title || 'Persoonlijke Verzorging',
          description: t?.services?.persoonlijkeVerzorging?.description || '',
          href: '/services/persoonlijke-verzorging',
          image: '/images/services/persoonlijke-verzorging-preview.jpg',
          icon: '🛁',
        },
        {
          title: t?.services?.begeleiding?.title || 'Begeleiding',
          description: t?.services?.begeleiding?.description || '',
          href: '/services/begeleiding',
          image: '/images/services/begeleiding-preview.jpg',
          icon: '🤝',
        },
        {
          title: t?.services?.huishoudelijkeHulp?.title || 'Huishoudelijke Hulp',
          description: t?.services?.huishoudelijkeHulp?.description || '',
          href: '/services/huishoudelijke-hulp',
          image: '/images/services/huishoudelijke-hulp-preview.jpg',
          icon: '🏠',
        },
      ];
    } catch (error) {
      console.error('Services error:', error);
      // Return fallback services
      return [
        {
          title: 'Persoonlijke Verzorging',
          description: '',
          href: '/services/persoonlijke-verzorging',
          image: '/images/services/persoonlijke-verzorging-preview.jpg',
          icon: '🛁',
        },
        {
          title: 'Begeleiding',
          description: '',
          href: '/services/begeleiding',
          image: '/images/services/begeleiding-preview.jpg',
          icon: '🤝',
        },
        {
          title: 'Huishoudelijke Hulp',
          description: '',
          href: '/services/huishoudelijke-hulp',
          image: '/images/services/huishoudelijke-hulp-preview.jpg',
          icon: '🏠',
        },
      ];
    }
  }, [t]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="/images/hero/hero-image.png"
            alt="Stralendezorg - Persoonlijke zorg"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
          {/* Overlay for better text readability - lighter and more harmonious */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700/40 via-primary-600/35 to-secondary-700/40"></div>
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-secondary-50/20"></div>
        </motion.div>
        
        {/* Decorative blur elements */}
        <div className="absolute inset-0 opacity-20 z-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <MotionWrapper className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t.home?.hero?.title || 'Stralendezorg'}
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl text-white mb-4 font-semibold drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t.home?.hero?.subtitle || 'Persoonlijke thuiszorg met een warm hart'}
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t.home?.hero?.description || 'Wij zijn een kleinschalige thuiszorg bedrijf die de cliënt en de verzorgende graag in verbintenis wilt brengen.'}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <CTAButton href="/contact" variant="primary" className="text-lg px-8 py-4 shadow-2xl">
                {t.home?.hero?.cta || 'Neem Contact Op'}
              </CTAButton>
              <CTAButton href="/about" variant="secondary" className="text-lg px-8 py-4 shadow-2xl bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30">
                {t.home?.hero?.ctaSecondary || 'Meer Informatie'}
              </CTAButton>
            </motion.div>
          </MotionWrapper>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <MotionWrapper className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.home?.services?.title || 'Onze Diensten'}
            </h2>
            <p className="text-xl text-gray-600">
              {t.home?.services?.subtitle || 'Wat wij voor u kunnen betekenen'}
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.href}
                title={service.title}
                description={service.description}
                href={service.href}
                image={service.image}
                icon={service.icon}
                delay={index * 0.2}
                ctaText={t.services?.overview?.cta || 'Meer Informatie'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <MotionWrapper>
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-preview.jpg"
                  alt="Stralendezorg - Persoonlijke zorg"
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
                {t.home?.about?.title || 'Over Stralendezorg'}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {t.home?.about?.subtitle || 'Persoonlijke zorg met aandacht'}
              </p>
              <p className="text-lg text-gray-700 mb-8">
                {t.home?.about?.description || 'Wij begrijpen dat cliënten behoefte hebben aan vaste gezichten, verzorgers en begeleiders.'}
              </p>
              <CTAButton href="/about" variant="primary">
                {t.home?.about?.cta || 'Meer Over Ons'}
              </CTAButton>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t.home?.cta?.title || 'Klaar om te beginnen?'}
        description={t.home?.cta?.description || 'Neem vandaag nog contact met ons op voor een vrijblijvend gesprek.'}
        primaryButton={{
          text: t.home?.cta?.button || 'Contact Opnemen',
          href: '/contact',
        }}
      />
    </div>
  );
}
