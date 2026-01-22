'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CTAButton from './CTAButton';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  icon?: string;
  delay?: number;
  ctaText?: string;
}

export default function ServiceCard({
  title,
  description,
  href,
  image,
  icon,
  delay = 0,
  ctaText = 'Meer Informatie',
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {icon && !image && (
        <div className="h-48 flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
          <span className="text-6xl">{icon}</span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{description}</p>
        <CTAButton href={href} variant="primary" className="w-full">
          {ctaText}
        </CTAButton>
      </div>
    </motion.div>
  );
}
