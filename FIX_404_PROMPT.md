# 404 Hata Düzeltme Prompt'u

Bu prompt, Next.js projelerinde 404 hatası aldığınızda hızlıca sorunu çözmek için kullanılır.

## Prompt:

```
Next.js projemde 404 hatası alıyorum. Sayfa build ediliyor ama runtime'da 404 gösteriyor. 

Şu adımları izle:

1. **Build durumunu kontrol et:**
   - `npm run build` çalıştır ve hata var mı kontrol et
   - Eğer build hatası varsa, önce onu düzelt

2. **Cache temizle:**
   - Development server'ı durdur: `pkill -f "next dev"`
   - `.next` klasörünü sil: `rm -rf .next`
   - `node_modules/.cache` varsa onu da sil

3. **Sayfa component'ini kontrol et:**
   - Sayfa `'use client'` direktifi ile başlıyor mu?
   - Translation'lara erişimde optional chaining (`?.`) kullanılıyor mu?
   - `useMemo` ile translation'lar memoize edilmiş mi?
   - Try-catch ile hata yakalama var mı?
   - Fallback değerler sağlanmış mı?

4. **Translation güvenliği:**
   - Tüm translation erişimlerinde `t?.section?.field || 'Fallback'` formatı kullan
   - Array işlemlerinde `(t?.array || []).map()` kullan
   - `useMemo` ile translation'ları memoize et:
     ```typescript
     const t = useMemo(() => {
       try {
         return getTranslation(lang);
       } catch (error) {
         console.error('Translation error:', error);
         return getTranslation('nl');
       }
     }, [lang]);
     ```

5. **Component import'larını kontrol et:**
   - Tüm component'ler doğru export edilmiş mi?
   - Client component'ler `'use client'` ile işaretlenmiş mi?
   - Server component'te client component kullanılıyorsa, ayrı bir client wrapper component oluştur

6. **Image kullanımı:**
   - Image component'leri `fill` prop'u ile kullanılıyorsa, parent div `relative` olmalı
   - Image path'leri `/images/...` formatında olmalı (public klasöründen)
   - `priority` prop'u önemli görsellerde kullanılmalı

7. **Build ve test:**
   - `npm run build` ile build et
   - Build başarılıysa `npm run dev` ile development server'ı başlat
   - Browser'da hard refresh yap: `Ctrl+Shift+R` (Windows/Linux) veya `Cmd+Shift+R` (Mac)

8. **Hala 404 alıyorsan:**
   - Browser console'u aç (F12) ve hataları kontrol et
   - Network tab'ında 404 veren dosyaları kontrol et
   - Sayfayı minimal bir versiyona indirge ve test et
   - Component'leri tek tek ekleyerek sorunlu olanı bul

Önemli: Her değişiklikten sonra cache temizle ve build et. Browser cache'ini de temizle.
```

## Hızlı Çözüm Komutları:

```bash
# 1. Cache temizle ve server'ı durdur
pkill -f "next dev" && rm -rf .next && echo "Cache temizlendi"

# 2. Build et
npm run build

# 3. Development server'ı başlat
npm run dev
```

## Yaygın Sorunlar ve Çözümleri:

### Sorun 1: Translation erişim hatası
**Çözüm:** Optional chaining ve fallback değerler kullan
```typescript
// ❌ YANLIŞ
{t.about.hero.title}

// ✅ DOĞRU
{t?.about?.hero?.title || 'Fallback Title'}
```

### Sorun 2: Array map hatası
**Çözüm:** Boş array fallback kullan
```typescript
// ❌ YANLIŞ
{t.about.values.items.map(...)}

// ✅ DOĞRU
{(t?.about?.values?.items || []).map(...)}
```

### Sorun 3: Client component server component'te kullanımı
**Çözüm:** Ayrı client wrapper component oluştur
```typescript
// components/ClientWrapper.tsx
'use client';
import { Component } from 'package';

export default function ClientWrapper() {
  return <Component />;
}

// app/layout.tsx (server component)
import ClientWrapper from '@/components/ClientWrapper';
// ...
<ClientWrapper />
```

### Sorun 4: Image component hatası
**Çözüm:** Parent div relative olmalı ve Image doğru kullanılmalı
```typescript
<div className="relative h-96 w-full">
  <Image
    src="/images/photo.jpg"
    alt="Description"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
    priority
  />
</div>
```

## Checklist:

Her değişiklikten sonra:
- [ ] Build başarılı mı? (`npm run build`)
- [ ] Cache temizlendi mi? (`.next` klasörü silindi)
- [ ] Translation'lar güvenli mi? (optional chaining, fallback)
- [ ] Component'ler doğru export edilmiş mi?
- [ ] Client/Server component ayrımı doğru mu?
- [ ] Browser cache temizlendi mi? (Hard refresh)
- [ ] Console'da hata var mı? (F12 → Console)

## Notlar:

- 404 hatası genellikle runtime hatasından kaynaklanır, build hatası değil
- Cache sorunları çok yaygın - her zaman cache temizle
- Translation erişimleri en yaygın hata kaynağı
- Browser cache'i de önemli - hard refresh yapmayı unutma
