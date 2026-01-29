# Stralendezorg.nl – Beyaz ekran / chunk 404: Kontrol listesi

## Belirti
- Sayfa 1 an görünüyor, hemen ardından beyaz ekran.
- Console: `GET .../_next/static/chunks/... 404`, `ChunkLoadError`, MIME type `text/html`.

## Neden
Sunucuda **build alınmıyor** veya **Node uygulaması siteyi sunmuyor**. `/_next/static/` dosyaları yok veya Apache tüm istekleri HTML’e yönlendiriyor.

---

## Yapılacaklar (Hostinger’da)

### 1. GitHub’dan pull sonrası mutlaka build
Proje klasöründe (SSH veya Node.js Manager terminali):

```bash
cd /path/to/zorgstralende
npm ci
npm run build
```

### 2. Node uygulamasını yeniden başlat
Hostinger panel → **Node.js Manager** → uygulamayı **Restart** et.

### 3. Start command doğru mu?
- **Önerilen:** `npm start` (proje kök dizininde çalışmalı).
- **Alternatif (standalone):** Build sonrası:
  ```bash
  cp -r public .next/standalone/
  cp -r .next/static .next/standalone/.next/
  ```
  Start command: `node .next/standalone/server.js` (yine proje kökünden).

### 4. Apache kullanılıyorsa
`/_next/` veya `*.js` isteklerini **index.html’e yönlendirmeyin**. Tüm istekler Node’a gitmeli, örnek:

```apache
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

(Port’u Node uygulamanızın dinlediği porta göre değiştirin.)

### 5. Çalışma dizini
Node uygulaması **proje kökünde** (içinde `package.json`, `.next`, `public` olan klasör) başlatılmalı.

---

## Kontrol
- [ ] Her `git pull` sonrası `npm ci` ve `npm run build` çalıştırıldı.
- [ ] Node uygulaması restart edildi.
- [ ] Start command: `npm start` veya `node .next/standalone/server.js`.
- [ ] Apache’de SPA rewrite yok; proxy Node’a gidiyor.
- [ ] Tarayıcıda hard refresh (Ctrl+Shift+R / Cmd+Shift+R) veya gizli pencere ile test.

Bu adımlar tamamsa `/_next/static/` istekleri 200 dönmeli ve site normal açılır.
