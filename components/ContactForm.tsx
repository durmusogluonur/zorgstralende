'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { getTranslation, Language } from '@/lib/translations';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy to continue',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  lang: Language;
}

export default function ContactForm({ lang }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const t = getTranslation(lang);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameValue = watch('name');
  const emailValue = watch('email');
  const phoneValue = watch('phone');
  const messageValue = watch('message');

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 border border-primary-100/50 backdrop-blur-sm"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-gray-900 mb-2"
      >
        {t.contact.form.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 mb-8"
      >
        {t.contact.form.subtitle}
      </motion.p>

      <div className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <label
            htmlFor="name"
            className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
              focusedField === 'name' || nameValue
                ? 'top-2 text-xs text-primary-600 font-semibold'
                : 'top-4 text-sm text-gray-500'
            }`}
          >
            {t.contact.form.name}
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 pt-6 pb-3 border-2 rounded-xl transition-all duration-300 text-gray-900 ${
              errors.name
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : focusedField === 'name'
                ? 'border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 shadow-lg'
                : 'border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100'
            } bg-white/90 backdrop-blur-sm outline-none placeholder-transparent`}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <label
            htmlFor="email"
            className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
              focusedField === 'email' || emailValue
                ? 'top-2 text-xs text-primary-600 font-semibold'
                : 'top-4 text-sm text-gray-500'
            }`}
          >
            {t.contact.form.email}
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 pt-6 pb-3 border-2 rounded-xl transition-all duration-300 text-gray-900 ${
              errors.email
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : focusedField === 'email'
                ? 'border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 shadow-lg'
                : 'border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100'
            } bg-white/90 backdrop-blur-sm outline-none placeholder-transparent`}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <label
            htmlFor="phone"
            className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
              focusedField === 'phone' || phoneValue
                ? 'top-2 text-xs text-primary-600 font-semibold'
                : 'top-4 text-sm text-gray-500'
            }`}
          >
            {t.contact.form.phone}
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 pt-6 pb-3 border-2 rounded-xl transition-all duration-300 text-gray-900 ${
              errors.phone
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : focusedField === 'phone'
                ? 'border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 shadow-lg'
                : 'border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100'
            } bg-white/90 backdrop-blur-sm outline-none placeholder-transparent`}
          />
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <label
            htmlFor="message"
            className={`absolute left-4 top-4 transition-all duration-300 pointer-events-none z-10 ${
              focusedField === 'message' || messageValue
                ? 'text-xs text-primary-600 font-semibold top-2'
                : 'text-sm text-gray-500'
            }`}
          >
            {t.contact.form.message}
          </label>
          <textarea
            id="message"
            {...register('message')}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            rows={6}
            className={`w-full px-4 pt-8 pb-3 border-2 rounded-xl transition-all duration-300 resize-none text-gray-900 ${
              errors.message
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : focusedField === 'message'
                ? 'border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 shadow-lg'
                : 'border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100'
            } bg-white/90 backdrop-blur-sm outline-none placeholder-transparent`}
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {errors.message.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* GDPR Privacy Consent */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
          className="relative"
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacyConsent"
              {...register('privacyConsent')}
              className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="privacyConsent"
              className="text-sm text-gray-700 cursor-pointer"
            >
              {t.contact.form.privacyText || (lang === 'nl' 
                ? 'Ik ga akkoord met het privacybeleid en geef toestemming voor de verwerking van mijn gegevens.'
                : 'I agree to the privacy policy and consent to the processing of my data.')}
            </label>
          </div>
          <AnimatePresence>
            {errors.privacyConsent && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {errors.privacyConsent.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                ⏳
              </motion.span>
              {t.contact.form.sending}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>✉️</span>
              {t.contact.form.submit}
            </span>
          )}
        </motion.button>

        {/* Success Message */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl text-green-800 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
                <p className="font-semibold">{t.contact.form.success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl text-red-800 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-2xl"
                >
                  ❌
                </motion.span>
                <p className="font-semibold">{t.contact.form.error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
