# LAG PHONES — Website Premium

Website premium, cinematográfico e profissional para a LAG PHONES.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Lenis (smooth scroll)
- Lucide React

## Como iniciar

```bash
npm install
npm run dev
```

O site estará disponível em `http://localhost:5173`

## Estrutura de pastas

```
lag-phones/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
│
├── public/
│   └── images/             ← Adicione as imagens aqui
│       ├── logo-placeholder.png
│       ├── hero/
│       │   └── hero-phone.png
│       ├── catalog/
│       │   ├── iphone-placeholder.jpg
│       │   ├── apple-watch-placeholder.jpg
│       │   ├── macbook-placeholder.jpg
│       │   ├── airpods-placeholder.jpg
│       │   ├── xiaomi-placeholder.jpg
│       │   ├── jbl-placeholder.jpg
│       │   ├── seminovos-placeholder.jpg
│       │   └── acessorios-placeholder.jpg
│       ├── assistencia/
│       │   └── lab-placeholder.jpg
│       ├── before-after/
│       │   ├── before-placeholder.jpg
│       │   └── after-placeholder.jpg
│       ├── upgrade/
│       │   └── trade-in-placeholder.jpg
│       ├── about/
│       │   └── store-placeholder.jpg
│       └── testimonials/
│           ├── avatar-1-placeholder.jpg
│           ├── avatar-2-placeholder.jpg
│           ├── avatar-3-placeholder.jpg
│           ├── avatar-4-placeholder.jpg
│           ├── avatar-5-placeholder.jpg
│           └── avatar-6-placeholder.jpg
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   └── Section.tsx
    ├── sections/
    │   ├── Hero.tsx
    │   ├── Consultor.tsx
    │   ├── SocialProof.tsx
    │   ├── Catalog.tsx
    │   ├── Assistencia.tsx
    │   ├── Process.tsx
    │   ├── BeforeAfter.tsx
    │   ├── Upgrade.tsx
    │   ├── Differentials.tsx
    │   ├── About.tsx
    │   ├── Testimonials.tsx
    │   └── FinalCTA.tsx
    ├── hooks/
    │   ├── useLenis.ts
    │   ├── useScrollReveal.ts
    │   └── useCounter.ts
    ├── lib/
    │   └── constants.ts
    └── styles/
        └── globals.css
```

## Como personalizar

### 1. Número do WhatsApp

Abra `src/lib/constants.ts` e substitua:

```ts
export const WHATSAPP_NUMBER = '5579999999999' // ← Coloque o número aqui
```

### 2. Logo

Adicione sua logo em `/public/images/logo-placeholder.png`

### 3. Imagens de produtos

Adicione as imagens de cada categoria em `/public/images/catalog/`
com os nomes exatos listados na estrutura acima.

### 4. Hero

Adicione a imagem ou vídeo principal em `/public/images/hero/hero-phone.png`

### 5. Fotos da loja / laboratório / before-after

Adicione as imagens correspondentes nas pastas acima.

### 6. Depoimentos reais

Edite o array `TESTIMONIALS` em `src/lib/constants.ts` com os depoimentos reais dos clientes.

### 7. Instagram URL

Em `src/lib/constants.ts`:
```ts
export const INSTAGRAM_URL = 'https://instagram.com/lagphones' // ← Atualize
```

## Build para produção

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## Deploy

O projeto pode ser hospedado em qualquer serviço de static hosting:
- Vercel (recomendado)
- Netlify
- Cloudflare Pages
- GitHub Pages

Para Vercel:
```bash
npm install -g vercel
vercel
```

---

Desenvolvido com ❤️ para LAG PHONES
