# DRILLPEDIA — Буровая Энциклопедия

## Полностью бесплатно!
Использует Hugging Face Inference API (бесплатный, без ключа).

## Деплой на Vercel

### Способ 1 — через GitHub
1. Залей папку на GitHub (новый репозиторий)
2. Зайди на vercel.com → New Project
3. Импортируй репозиторий → Deploy

### Способ 2 — Vercel CLI
```bash
npm install
npm run dev      # проверить локально на http://localhost:5173

npm install -g vercel
vercel login
vercel
```

## ⚠️ Особенности Hugging Face бесплатного API
- Модель может "спать" — первый запрос займёт 20–30 сек
- Лимит: ~1000 бесплатных запросов/день
- Если нужно больше — зарегистрируйся на huggingface.co и добавь токен
