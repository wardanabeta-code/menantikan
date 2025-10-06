# 🗺️ PROJECT ROADMAP — MENANTIKAN

## 🏗️ PROJECT OVERVIEW

**Project Name:** Menantikan  
**Domain:** [https://menantikan.com](https://menantikan.com)  
**Tagline:** Buat, sesuaikan, dan bagikan undangan digital yang penuh makna.  

**Frontend Tech:** Vite + React + TypeScript + TailwindCSS + Zustand (State) + Framer Motion (Animation)  
**Backend Tech:** Firebase (Auth, Firestore, Storage, Functions)  
**Hosting Platform:** Hostinger (App + Build Deploy via CI/CD pipeline)  

**Objective:**  
Membangun platform undangan digital interaktif bernama **Menantikan**, di mana pengguna dapat membuat, menyesuaikan, dan membagikan undangan mereka dengan template yang dinamis, personalisasi tinggi, dan sistem interaktif berbasis Firebase.

---

## ⚙️ PHASE 1 — MVP (Minimum Viable Product)

### 🎯 Goal
Membuat versi dasar **Menantikan** yang memungkinkan user membuat dan membagikan undangan digital dengan flow lengkap.

### 🔹 Fitur Utama
1. **Landing Page**
   - Menampilkan template contoh di `menantikan.com`
   - CTA “Buat Undangan Sekarang”
   - Routing ke `/templates`

2. **Template System**
   - Template berbasis JSON (`colors`, `fonts`, `ornaments`, `animations`)
   - Komponen utama: `<TemplateRenderer />`
   - Minimal 2 template: Wedding & Birthday

3. **User Flow Dasar**
   - `/templates` → pilih template  
   - `/editor/:id` → isi data & edit tampilan  
   - `/preview/:id` → lihat hasil  
   - `/publish/:id` → terbitkan & dapatkan link publik  

4. **Firebase Integration**
   - **Firebase Auth (Google Sign-In)**
   - **Firestore**: menyimpan data undangan  
   - **Storage**: upload foto & musik  

5. **Public Invitation Page**
   - Route: `/invitation/:slug`
   - Render template dari data Firestore + custom user style

6. **Auto-Save & State Management**
   - Auto-save ke Firestore setiap perubahan
   - Zustand store untuk state lokal  

7. **TypeScript Implementation**
   - Interface untuk `Invitation`, `Template`, `ThemeConfig`
   - Strict typing untuk semua data & komponen

### 🔧 Deliverables
- 2 Template (Wedding, Birthday)
- Editor Page & Preview live
- Firestore schema awal
- Google login & Firestore CRUD
- Deployed ke Hostinger dengan CI/CD (auto build Vite)

---

## 🚀 PHASE 2 — INTERAKTIFITAS & ENGAGEMENT

### 🎯 Goal
Meningkatkan pengalaman pengguna dan tamu melalui fitur real-time.

### 🔹 Fitur Utama
1. **RSVP System**
   - Form RSVP pada halaman publik
   - Data tersimpan di Firestore (`rsvps`)
   - Dashboard statistik RSVP

2. **Guestbook (Ucapan Tamu)**
   - Tamu bisa mengirim ucapan & doa
   - Real-time listener (onSnapshot)
   - Moderasi oleh pemilik undangan

3. **Dashboard Statistik**
   - Jumlah kunjungan, RSVP, ucapan
   - Visualisasi menggunakan Recharts

4. **Gallery & Media Upload**
   - Upload foto ke Firebase Storage
   - Ditampilkan di halaman undangan

5. **Background Music**
   - Pilih musik bawaan atau upload sendiri
   - Play/pause dan auto-play

---

## 💎 PHASE 3 — PERSONALISASI & MONETISASI

### 🎯 Goal
Membuka fitur kustomisasi desain penuh dan model bisnis premium.

### 🔹 Fitur Utama
1. **Advanced Template Customization**
   - User bisa ubah warna, font, animasi, ornament
   - Theme merging system (default + user custom)
   - Preset tema siap pakai

2. **Guest Management**
   - Upload daftar tamu (CSV/manual)
   - Link personal: `menantikan.com/invitation/slug?to=NamaTamu`
   - RSVP tracking per tamu

3. **Payment & Premium Subscription**
   - Paket Gratis: watermark, fitur dasar
   - Paket Premium: hapus watermark, custom domain
   - Integrasi Firebase Functions + Midtrans/Xendit

4. **Custom Domain/Subdomain**
   - Format: `andi-nina.menantikan.com`
   - Custom domain untuk user premium

5. **QR Code Generator**
   - Generate QR untuk link undangan
   - Simpan ke Firebase Storage

---

## 🧠 PHASE 4 — AUTOMATION, AI & ADVANCED EXPERIENCE

### 🎯 Goal
Meningkatkan pengalaman dengan fitur AI dan automasi.

### 🔹 Fitur Utama
1. **Event Reminder System**
   - Email reminder (Firebase Functions + SendGrid)
   - “Add to Calendar” integration

2. **AI Assistant**
   - Generate teks undangan otomatis
   - Rekomendasi warna & font (OpenAI API)

3. **Section Layout Builder**
   - Drag & drop section (Hero, Story, RSVP, Gallery)
   - Tampilkan/sembunyikan section

4. **Template Marketplace**
   - Desainer upload template JSON
   - Admin moderasi & bagi hasil

5. **Performance Optimization**
   - Lazy load media
   - PWA mode (offline-ready)

---

## 🛠️ PHASE 5 — ADMIN PANEL & ECOSISTEM LENGKAP

### 🎯 Goal
Menghadirkan sistem administrasi penuh untuk mengelola Menantikan.

### 🔹 Fitur Utama
1. **Admin Dashboard**
   - CRUD user, template, payment
   - Statistik global
   - Role-based Firebase Auth

2. **Referral & Affiliate**
   - Referral link per user
   - Tracking di Firestore (`referrals`)

3. **Analytics & Reports**
   - Statistik undangan, views, transaksi
   - Export CSV

4. **Localization & SEO**
   - Multi-bahasa (ID/EN)
   - Dynamic meta tags per undangan

5. **Public API**
   - Token-based API untuk integrasi pihak ketiga
   - Swagger documentation

---

## 🌐 DEPLOYMENT PLAN (HOSTINGER)

**Frontend Build**
- Build React App:  
  ```bash
  npm run build
  ```
  Output: `/dist`

**Deployment**
- Upload folder `/dist` ke Hostinger (File Manager / FTP)  
- Atur domain utama: `menantikan.com` → arahkan ke folder build  
- Gunakan pipeline otomatis (CI/CD GitHub Action → Hostinger Deploy via FTP)  

**Backend (Firebase)**
- Firebase Auth, Firestore, Storage tetap digunakan  
- Functions digunakan untuk: pembayaran, email reminder, webhook, dsb.  
- Komunikasi dilakukan via Firebase SDK (no server custom di Hostinger)  

---

## ✅ SUMMARY
Roadmap **Menantikan** meliputi 5 tahap:
1. MVP: Template, Editor, Firebase dasar  
2. Interaktifitas: RSVP, Guestbook, Dashboard  
3. Personalisasi: Theme, Payment, QR  
4. AI & Automasi: Reminder, Template Builder  
5. Admin & API: Pengelolaan penuh  
