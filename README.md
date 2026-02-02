# Seçkin Kırtasiye — Website

Seçkin Kitap Kırtasiye Oyuncak ve Ofis Malzemeleri (Arnavutköy / İstanbul) için hazırlanmış, **tek sayfa**, **mobil uyumlu**, iletişim odaklı bir tanıtım sitesidir.

Site; tek tıkla arama, Google Haritalar’dan yol tarifi, çalışma saatleri, duyurular ve yayın evi yönlendirmeleri gibi hızlı erişim özelliklerine odaklanır.

---

## Özellikler

- Mobil uyumlu (responsive) tek sayfa tasarım  
- “Hemen Ara” butonu ile direkt telefon araması  
- Google Haritalar linki + sayfa içinde harita görünümü  
- Çalışma saatleri tablosu  
- Güncel **açık / kapalı** durumu (saatlere göre otomatik)  
- Duyurular alanı  
- Yayın evleri için yönlendirme linkleri  

---

## Dosya Yapısı

```
.
├─ index.html
├─ styles.css
├─ app.js
├─ icon.png
└─ seckin_logo.png
```

- `index.html` → Sayfanın HTML yapısı  
- `styles.css` → Tüm stil ve responsive düzen  
- `app.js` → Harita, çalışma saatleri, açık/kapalı durumu, duyurular ve yayın evleri  
- `icon.png` → Favicon  
- `seckin_logo.png` → Logo  

---

## Localde Çalıştırma (VS Code + Live Server)

Bu proje statik bir web sitesidir, ekstra kurulum gerekmez.

### 1) Live Server eklentisini kur
- VS Code → Extensions (Ctrl + Shift + X)  
- **Live Server** (Ritwick Dey) eklentisini yükle

### 2) Siteyi çalıştır
- Proje klasörünü VS Code ile aç  
- `index.html` dosyasına sağ tıkla  
- **Open with Live Server** seç

Site otomatik olarak tarayıcıda açılır  
(örnek: `http://127.0.0.1:5500`).

> Dosyalarda yapılan değişiklikler sayfaya otomatik olarak yansır.

---

## İçerik Güncelleme

### Duyurular
`app.js` içindeki `ANNOUNCEMENTS` dizisi düzenlenir:

```js
const ANNOUNCEMENTS = [
  {
    title: "Başlık",
    date: "YYYY-MM-DD",
    body: "Duyuru açıklaması"
  }
];
```

### Yayın Evleri
`app.js` içindeki `PUBLISHERS` dizisi düzenlenir:

```js
const PUBLISHERS = [
  { name: "Yayın Evi Adı", url: "https://..." }
];
```

### Çalışma Saatleri
`app.js` içindeki `HOURS` objesi düzenlenir:

```js
const HOURS = {
  1: { open: "07:15", close: "19:00" }, // Pazartesi
  2: { open: "07:15", close: "19:00" },
  3: { open: "07:15", close: "19:00" },
  4: { open: "07:15", close: "19:00" },
  5: { open: "07:15", close: "19:00" },
  6: { open: "09:00", close: "18:30" }, // Cumartesi
  0: null // Pazar (kapalı)
};
```

---

## Yayınlama

Bu site statik olduğu için aşağıdaki platformlarda kolayca yayınlanabilir:

- GitHub Pages  
- Netlify  
- Vercel  
- Cloudflare Pages  

Herhangi bir build işlemi gerekmez.

---

## İşletme Bilgileri

**Seçkin Kitap Kırtasiye Oyuncak ve Ofis Malzemeleri**  
Arnavutköy / İstanbul  

Telefon: 0212 597 68 67  

---

## Lisans

Bu proje Seçkin Kırtasiye için hazırlanmıştır.  
İstenirse açık kaynak lisansı eklenebilir.
