'use client';

import MotionWrapper from './MotionWrapper';
import CTAButton from './CTAButton';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryButton: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  className = '',
}: CTASectionProps) {
  return (
    <section className={`py-20 bg-gradient-to-br from-primary-50 to-secondary-50 ${className}`}>
      <div className="container mx-auto px-4">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-xl text-gray-600 mb-8">{description}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton
              href={primaryButton.href}
              onClick={primaryButton.onClick}
              variant="primary"
            >
              {primaryButton.text}
            </CTAButton>
            {secondaryButton && (
              <CTAButton
                href={secondaryButton.href}
                onClick={secondaryButton.onClick}
                variant="outline"
              >
                {secondaryButton.text}
              </CTAButton>
            )}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
