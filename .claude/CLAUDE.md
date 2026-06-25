# Mundo Cubiertas — Reglas globales del proyecto

> Path of truth: `Plan_Sistema_Mundo_Cubiertas.md` en la raíz del repo.
> Antes de tomar cualquier decisión técnica, consulta ese documento.

## Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: NestJS, Prisma, PostgreSQL
- Bot: WhatsApp Business API + Baileys (Fase 3 — aún no implementado)
- Storage: AWS S3 para planos y PDFs (Fase 2 — placeholder en Fase 1)

## Reglas de código
- TypeScript estricto en todo el proyecto (`strict: true`)
- Nombres en español para variables de dominio (`cotizacion`, `cliente`, `producto`)
- Nombres en inglés para infraestructura (`service`, `controller`, `module`)
- Commits en inglés, issues y comentarios en español
- Nunca hardcodear credenciales; usar `.env` y validar con `@nestjs/config`

## Flujo crítico: cotizaciones
- Siempre manejar el campo `tiene_planos: boolean` en cotizaciones
- Con planos: guardar `url_planos` (en Fase 1 es texto; en Fase 2 sube a S3)
- Sin planos: precio de referencia con nota de que puede variar
- Estados válidos: `borrador`, `enviada`, `aceptada`, `rechazada`, `expirada`

## Estructura de directorios
Cada agente trabaja solo en su directorio asignado. No cruzar fronteras entre `backend/`, `frontend/`, `bot/`, `prisma/`.

```
mundo-cubiertas/
├── backend/     ← agente: backend
├── frontend/    ← agente: frontend
├── bot/         ← agente: whatsapp-bot (Fase 3)
├── prisma/      ← agente: database
└── scripts/     ← agente: database
```

## Comandos útiles
```bash
docker-compose up -d          # levantar PostgreSQL local
npx prisma migrate dev        # aplicar migraciones
npx prisma db seed            # sembrar datos de prueba
cd backend && npm run dev     # backend en http://localhost:3000
cd frontend && npm run dev    # frontend en http://localhost:3001
npm test                      # correr tests
```

## Fases del proyecto
- **Fase 1** (actual): Vitrina + formulario de cotización básico
- **Fase 2**: CRM + PDF de cotizaciones + panel admin + auth
- **Fase 3**: Bot WhatsApp + inventario
- **Fase 4**: Pagos en línea + redes sociales
