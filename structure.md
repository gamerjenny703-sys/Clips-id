.
├── app/
│   └── (routing dan API-mu, tetap sama)
├── components/
│   ├── features/             <-- BARU: Komponen spesifik untuk setiap fitur
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── contest/
│   │   │   ├── ContestCard.tsx
│   │   │   ├── ContestList.tsx
│   │   │   └── ContestDetailsView.tsx
│   │   ├── payment/
│   │   │   └── PaymentSystem.tsx
│   │   ├── progress/
│   │   │   └── ProgressTracker.tsx
│   │   └── social/
│   │       └── SocialOAuth.tsx
│   ├── shared/               <-- BARU: Komponen yang dipakai di banyak tempat
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/                   <-- (Tidak berubah, tetap berisi komponen shadcn)
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── types.ts              <-- BARU: Untuk semua definisi tipe global
│   └── utils.ts
└── ... (sisa file)
