# Буровая Энциклопедия

## Деплой на Vercel

### Способ 1 — через GitHub (рекомендуется)

1. Создай репозиторий на GitHub
2. Загрузи все файлы этой папки
3. Зайди на vercel.com → New Project
4. Импортируй репозиторий — Vercel сам всё настроит

### Способ 2 — через Vercel CLI

```bash
npm install
npm run dev      # проверить локально

npm install -g vercel
vercel login
vercel           # деплой
```

### ⚠️ Важно: API ключ Anthropic

Приложение использует Anthropic Claude API.
На Vercel добавь переменную окружения:

  VITE_ANTHROPIC_API_KEY=sk-ant-...

Settings → Environment Variables → Add

> Или временно можно захардкодить ключ в src/DrillingEncyclopedia.jsx
> в функции callAI в заголовок Authorization.
