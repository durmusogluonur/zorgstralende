# reCAPTCHA Enterprise Implementation Details

## Kod Yapısı

### Client-Side (ContactForm.tsx)
```typescript
grecaptcha.enterprise.ready(async () => {
  const token = await grecaptcha.enterprise.execute(siteKey, {
    action: 'contact_form',
  });
});
```

### Server-Side (app/api/contact/route.ts)

#### createAssessment Fonksiyonu
Google'ın resmi örneğine uygun olarak implement edildi:

```typescript
async function createAssessment(
  token: string,
  recaptchaAction: string = 'contact_form'
): Promise<boolean> {
  const client = await getRecaptchaClient();
  const projectPath = client.projectPath(projectID);
  
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);
  
  // Token validation
  if (!response.tokenProperties.valid) {
    return false;
  }
  
  // Action validation
  if (response.tokenProperties.action !== recaptchaAction) {
    return false;
  }
  
  // Risk score analysis
  const score = response.riskAnalysis.score;
  return score >= threshold;
}
```

## Doğrulama Adımları

1. **Token Validation**: Token geçerli mi?
2. **Action Validation**: Action eşleşiyor mu? (`contact_form`)
3. **Risk Score**: Score threshold'u geçiyor mu? (default: 0.5)

## Risk Score Yorumlama

- **0.9 - 1.0**: İnsan kullanıcı (yüksek güven)
- **0.5 - 0.9**: Muhtemelen insan
- **0.0 - 0.5**: Bot şüphesi (reddedilir)

## Logging

Server logs'da şunları görebilirsiniz:
```
The reCAPTCHA Enterprise score is: 0.9
Risk reason: AUTOMATED
Risk reason: LOW_CONFIDENCE_SCORE
```

## Fallback Mekanizması

1. Enterprise SDK yoksa → Basic verification
2. Enterprise SDK hata verirse → Basic verification
3. Basic verification da yoksa → Development'ta allow, production'da reject

## Environment Variables

**Gerekli:**
- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud Project ID
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA Site Key

**Opsiyonel:**
- `RECAPTCHA_SCORE_THRESHOLD` - Score threshold (default: 0.5)
- `RECAPTCHA_SECRET_KEY` - Fallback için basic verification

## Paket Kurulumu

```bash
npm install @google-cloud/recaptcha-enterprise
```

Paket yüklü değilse, kod otomatik olarak basic verification'a geçer.

## Test

1. Paketi yükleyin: `npm install @google-cloud/recaptcha-enterprise`
2. Google Cloud credentials yapılandırın
3. Contact formunu test edin
4. Server logs'da score'u kontrol edin
