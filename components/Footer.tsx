'use client';

import Link from 'next/link';
import { getTranslation, Language } from '@/lib/translations';
import { useState } from 'react';

export default function Footer() {
  const [lang, setLang] = useState<Language>('nl');
  const t = getTranslation(lang);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-primary-400">Stralendezorg</h3>
            <p className="text-gray-400 mb-4">{t.footer.description}</p>
            <button
              onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              {lang === 'nl' ? 'English' : 'Nederlands'}
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.links.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.links.about}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.links.services}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.links.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="font-semibold text-gray-300">Adres:</span><br />
                Middellaan 33G<br />
                5102PB Dongen
              </li>
              <li>
                <span className="font-semibold text-gray-300">Telefoon:</span><br />
                <a href="tel:+31850603854" className="hover:text-primary-400 transition-colors">
                  +31 85 060 3854
                </a>
              </li>
              <li>
                <span className="font-semibold text-gray-300">Email:</span><br />
                info@stralendezorg.nl
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
