# 404 Hata Önleme Rehberi

Bu dosya, gelecekte 404 hatası almamak için yapılması gerekenleri açıklar.

## Sorunun Kaynağı

404 hatası genellikle şu durumlarda oluşur:
1. Component render edilemediğinde
2. Import edilen bir modül bulunamadığında
3. Translation'lara erişim sırasında hata oluştuğunda
4. Runtime hatası oluştuğunda

## Çözüm: Güvenli Kodlama Prensipleri

### 1. Translation Kullanımı

**❌ YANLIŞ:**
```typescript
const t = getTranslation(lang);
const title = t.home.hero.title; // Hata: t undefined olabilir
```

**✅ DOĞRU:**
```typescript
const t = useMemo(() => {
  try {
    return getTranslation(lang);
  } catch (error) {
    console.error('Translation error:', error);
    return getTranslation('nl'); // Fallback
  }
}, [lang]);

const title = t?.home?.hero?.title || 'Fallback Title'; // Optional chaining
```

### 2. Component Import'ları

**❌ YANLIŞ:**
```typescript
import Component from '@/components/Component';
// Component export edilmemişse hata verir
```

**✅ DOĞRU:**
- Tüm component'lerin `export default` ile export edildiğinden emin olun
- Component'ler `'use client'` direktifi ile işaretlenmişse, client component olarak kullanın

### 3. Array/Object İşlemleri

**❌ YANLIŞ:**
```typescript
const items = data.items.map(...); // data undefined olabilir
```

**✅ DOĞRU:**
```typescript
const items = useMemo(() => {
  try {
    return data?.items?.map(...) || [];
  } catch (error) {
    console.error('Items error:', error);
    return [];
  }
}, [data]);
```

### 4. Image Kullanımı

**❌ YANLIŞ:**
```typescript
<Image src={image} alt="..." /> // image undefined olabilir
```

**✅ DOĞRU:**
```typescript
{image && (
  <Image src={image} alt="..." />
)}
```

### 5. Build Sonrası Test

Her değişiklikten sonra:
1. `npm run build` çalıştırın
2. Build başarılı olmalı
3. `npm run dev` ile test edin
4. Browser console'u kontrol edin (F12)

## Önemli Notlar

- **Optional Chaining (`?.`)**: Her zaman kullanın
- **Fallback Değerler**: Her zaman fallback değerler sağlayın
- **Try-Catch**: Kritik işlemlerde try-catch kullanın
- **useMemo**: Hesaplamaları memoize edin
- **Error Boundary**: Sayfayı error boundary ile sarmalayın

## Test Checklist

Değişiklik yaptıktan sonra:
- [ ] Build başarılı mı? (`npm run build`)
- [ ] Sayfa açılıyor mu? (http://localhost:3000)
- [ ] Console'da hata var mı? (F12 → Console)
- [ ] Network tab'ında 404 var mı? (F12 → Network)
- [ ] Hard refresh yaptınız mı? (Ctrl+Shift+R / Cmd+Shift+R)

## Sorun Giderme

Eğer hala 404 hatası alıyorsanız:

1. **Cache Temizle:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Browser Cache Temizle:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) veya Cmd+Shift+R (Mac)
   - Veya DevTools → Network → "Disable cache" işaretleyin

3. **Console Hatalarını Kontrol Et:**
   - F12 → Console
   - Kırmızı hataları not edin

4. **Minimal Test:**
   - Sayfayı minimal bir versiyona indirgeyin
   - Component'leri tek tek ekleyin
   - Sorunlu component'i bulun
