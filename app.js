// Seçkin Kırtasiye — Basit tek sayfa site JS
// - Harita linkleri
// - Çalışma saatleri tablosu + şu an açık mı?
// - Duyuru listesi
// - Yayın evi linkleri

const STORE = {
  nameShort: "Seçkin Kırtasiye",
  nameLong: "Seçkin Kitap Kırtasiye Oyuncak ve Ofis Malzemeleri",
  phoneDisplay: "0212 597 68 67",
  phoneE164: "+902125976867",
  instagramHandle: "seckinarnavutkoy",
  addressLine:
    "Arnavutköy Merkez Mah. Eski Edirne Asfaltı Cad. No: 1411A Arnavutköy/İstanbul",
};

const MAPS_QUERY = encodeURIComponent(STORE.addressLine);
const MAPS_URL = `https://www.google.com/maps/place/Se%C3%A7kin+K%C4%B1rtasiye/@41.184089,28.7345643,17z/data=!3m1!4b1!4m6!3m5!1s0x14caabc4536e6605:0xbbeea751a509f453!8m2!3d41.184089!4d28.7345643!16s%2Fg%2F1ptxg309j?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D`;

// Basit embed: query üzerinden
const MAPS_EMBED_URL ="https://www.google.com/maps?output=embed&q=Se%C3%A7kin+K%C4%B1rtasiye&ll=41.184089,28.7345643&z=19";


// Çalışma saatleri (istersen düzenle)
// 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi
// format: { open: "09:00", close: "20:00" } veya null (kapalı)
const HOURS = {
  1: { open: "07:15", close: "19:00" }, // Pazartesi
  2: { open: "07:15", close: "19:00" }, // Salı
  3: { open: "07:15", close: "19:00" }, // Çarşamba
  4: { open: "07:15", close: "19:00" }, // Perşembe
  5: { open: "07:15", close: "19:00" }, // Cuma
  6: { open: "09:00", close: "18:30" }, // Cumartesi
  0: null, // Pazar Kapalı
};


// Basit duyurular (ekle/çıkar)
// date: "YYYY-MM-DD"
const ANNOUNCEMENTS = [
  {
    title: "Okul sezonu stok bilgisi",
    date: "2026-02-02",
    body:
      "Okul listeleri ve yoğun dönemlerde hızlı teyit için arayabilirsiniz. Uygunsa ürünleri hazırlayıp bekletebiliriz.",
  },
  {
    title: "Fotokopi / çıktı hizmeti",
    date: "2026-02-02",
    body:
      "Fotokopi, çıktı ve temel ofis işlemleri için mağazamıza uğrayabilir veya önceden arayarak bilgi alabilirsiniz.",
  },
];

// Bayisi olduğunuz yayın evi linkleri (placeholder — sen linkleri verince doldur)
const PUBLISHERS = [
  { name: "Ata Yayıncılık", url: "https://www.atayayincilik.com.tr/" },
  { name: "Model Eğitim Yayınları", url: "https://www.modelegitim.com/" },
  { name: "Mavideniz Yayınları", url: "https://www.mavidenizyayinlari.com/" },
  { name: "Mutlu Yayınları", url: "https://www.e-mutlu.com/" },
];


// --- Helpers ---
function $(id) {
  return document.getElementById(id);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Istanbul saatini güvenli almak için Intl kullanıyoruz
function getIstanbulNow() {
  const dtf = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "long",
  });

  const parts = dtf.formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hour = Number(map.hour);
  const minute = Number(map.minute);
  const second = Number(map.second);

  // Not: Bu Date objesi yerel timezone’da; biz sadece gün/clock için kullanıyoruz.
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekdayTR: map.weekday,
    // JS getDay() yerine TR weekday ile mapping kullanacağız:
    dayIndex: weekdayTRtoIndex(map.weekday),
    minutesNow: hour * 60 + minute,
  };
}

function weekdayTRtoIndex(w) {
  // tr-TR: "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
  const m = {
    Pazar: 0,
    Pazartesi: 1,
    Salı: 2,
    "Çarşamba": 3,
    Perşembe: 4,
    Cuma: 5,
    Cumartesi: 6,
  };
  return m[w] ?? new Date().getDay();
}

function formatHours(range) {
  if (!range) return "Kapalı";
  return `${range.open} – ${range.close}`;
}

function nextOpenInfo(dayIndex, minutesNow) {
  // bugün kapanış sonrasıysa veya bugün kapalıysa bir sonraki açık günü bul
  for (let i = 0; i < 7; i++) {
    const d = (dayIndex + i) % 7;
    const h = HOURS[d];
    if (!h) continue;
    if (i === 0) {
      // bugün
      const openM = timeToMinutes(h.open);
      const closeM = timeToMinutes(h.close);
      if (minutesNow < openM) return { day: d, when: `Bugün ${h.open}’de açıyoruz.` };
      if (minutesNow >= closeM) continue;
      return { day: d, when: `Bugün ${h.close}’ye kadar açığız.` };
    }
    return { day: d, when: `${dayNameTR(d)} ${h.open}’de açıyoruz.` };
  }
  return { day: null, when: "Çalışma saatleri yakında güncellenecek." };
}

function dayNameTR(i) {
  return ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][i];
}

// --- Render ---
function setupLinks() {
  const igUrl = `https://www.instagram.com/${STORE.instagramHandle}/`;

  const mapsEls = ["mapsBtn", "mapsBtn2", "mapsBtn3", "mapsFallback", "mapsFooter"];
  mapsEls.forEach((id) => {
    const el = $(id);
    if (el) el.href = MAPS_URL;
  });

  const igEls = ["igBtn", "igFooter"];
  igEls.forEach((id) => {
    const el = $(id);
    if (el) el.href = igUrl;
  });

  const mapFrame = $("mapFrame");
  if (mapFrame) mapFrame.src = MAPS_EMBED_URL;
}

function renderHours() {
  const now = getIstanbulNow();
  const table = $("hoursTable");
  if (!table) return;

  table.innerHTML = "";

  for (let i = 1; i <= 6; i++) {
    // Pazartesi -> Cumartesi
    const row = makeHourRow(i, now.dayIndex);
    table.appendChild(row);
  }
  // Pazar en sona
  table.appendChild(makeHourRow(0, now.dayIndex));
}

function makeHourRow(dayIndex, todayIndex) {
  const row = document.createElement("div");
  row.className = "row";

  const range = HOURS[dayIndex];
  const isToday = dayIndex === todayIndex;

  if (isToday) row.classList.add("row--today");
  if (!range) row.classList.add("row--closed");

  const day = document.createElement("div");
  day.className = "day";
  day.textContent = dayNameTR(dayIndex);

  const time = document.createElement("div");
  time.className = "time";
  time.textContent = formatHours(range);

  row.appendChild(day);
  row.appendChild(time);
  return row;
}

function renderStatus() {
  const now = getIstanbulNow();
  const dot = $("statusDot");
  const title = $("statusTitle");
  const meta = $("statusMeta");
  if (!dot || !title || !meta) return;

  const today = HOURS[now.dayIndex];
  let isOpen = false;

  if (today) {
    const openM = timeToMinutes(today.open);
    const closeM = timeToMinutes(today.close);
    isOpen = now.minutesNow >= openM && now.minutesNow < closeM;
  }

  if (isOpen) {
    dot.style.background = "var(--accent)";
    title.textContent = "Şu an açığız";
    meta.textContent = `Bugün ${today.close}’ye kadar. (İstanbul saati)`;
  } else {
    dot.style.background = "var(--accent2)";
    title.textContent = "Şu an kapalıyız";
    const info = nextOpenInfo(now.dayIndex, now.minutesNow);

    const sundayNote =
      " Pazar günleri genelde kapalıyız; dönemsel değişiklik olabilir, arayarak teyit edin.";

    meta.textContent = info.when + sundayNote;
  }
}

function renderAnnouncements() {
  const wrap = $("announcements");
  if (!wrap) return;

  const items = [...ANNOUNCEMENTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  wrap.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "ann";
    empty.textContent = "Henüz duyuru eklenmedi.";
    wrap.appendChild(empty);
    return;
  }

  items.forEach((a) => {
    const el = document.createElement("div");
    el.className = "ann";

    const top = document.createElement("div");
    top.className = "ann__top";

    const t = document.createElement("div");
    t.className = "ann__title";
    t.textContent = a.title;

    const d = document.createElement("div");
    d.className = "ann__date";
    d.textContent = new Date(a.date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Istanbul",
    });

    const body = document.createElement("div");
    body.className = "ann__body";
    body.textContent = a.body;

    top.appendChild(t);
    top.appendChild(d);
    el.appendChild(top);
    el.appendChild(body);
    wrap.appendChild(el);
  });
}

function renderPublishers() {
  const wrap = $("publisherList");
  if (!wrap) return;

  wrap.innerHTML = "";

  PUBLISHERS.forEach((p) => {
    const row = document.createElement("div");
    row.className = "pub";

    const left = document.createElement("div");
    left.textContent = p.name;

    const right = document.createElement("a");
    right.href = p.url;
    right.target = "_blank";
    right.rel = "noreferrer";
    right.textContent = "Siteye git ↗";

    row.appendChild(left);
    row.appendChild(right);
    wrap.appendChild(row);
  });
}

function boot() {
  setupLinks();
  renderHours();
  renderStatus();
  renderAnnouncements();
  renderPublishers();

  // Durumun güncel kalması için (dakikada bir)
  setInterval(renderStatus, 60 * 1000);
}

document.addEventListener("DOMContentLoaded", boot);
