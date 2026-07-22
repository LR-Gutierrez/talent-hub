# TalentHub

TalentHub is a talent management platform. Modern, responsive admin dashboard built with React and TypeScript.

Key Features:
- **Responsive Layout**: Optimized for all screen sizes and devices.
- **Dark/Light Mode**: Easily switch between light and dark themes.
- **Configurable Themes**: Personalize colors, layouts, and more to fit your needs.
- **Built with React + TypeScript**: Ensures robust type-checking and fast development.
- **Multi-Locale Support**: Easily add and manage multiple languages.
- **RTL Support**: Full Right-to-Left support for languages like Arabic or Hebrew.
- **Tailwind Component-Based Architecture**: Reusable components to streamline your development process.
- **API Ready**: Simple integration with any RESTful API.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_NAME` | Application display name | TalentHub |
| `VITE_COMPANY_NAME` | Company name | Company |
| `VITE_APP_EMAIL_DOMAIN` | Email domain for example users | company.com |
| `VITE_FIREBASE_*` | Firebase configuration | — |
