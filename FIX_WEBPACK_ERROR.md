# Webpack Runtime Error Çözümü

## Hata
```
TypeError: Cannot read properties of undefined (reading 'call')
```

## Çözüm Adımları

### 1. Cache Temizleme
```bash
# Development server'ı durdur
pkill -f "next dev"

# Cache'leri temizle
rm -rf .next
rm -rf node_modules/.cache

# Yeniden başlat
npm run dev
```

### 2. Browser Cache Temizleme
- **Hard Refresh:** `Cmd + Shift + R` (Mac) veya `Ctrl + Shift + R` (Windows)
- Veya Browser DevTools → Network → "Disable cache" işaretle

### 3. Node Modules Yeniden Yükleme (Gerekirse)
```bash
rm -rf node_modules package-lock.json
npm install
```

### 4. Build Test
```bash
npm run build
```

Eğer build başarılıysa ama runtime'da hata varsa, genellikle cache sorunudur.

## Olası Nedenler

1. **Cache Sorunu:** `.next` klasörü bozuk olabilir
2. **Modül Yükleme:** Bir component düzgün import edilmemiş olabilir
3. **Browser Cache:** Eski JavaScript dosyaları cache'lenmiş olabilir

## Kontrol Listesi

- [ ] `.next` klasörü temizlendi
- [ ] `node_modules/.cache` temizlendi
- [ ] Browser cache temizlendi (Hard Refresh)
- [ ] Development server yeniden başlatıldı
- [ ] Build başarılı (`npm run build`)

## Hala Çalışmıyorsa

1. Browser console'u kontrol edin (F12)
2. Network tab'ında hangi dosyaların yüklenemediğini kontrol edin
3. Hata mesajının tamamını paylaşın
