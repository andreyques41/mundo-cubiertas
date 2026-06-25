# MUNDO CUBIERTAS
## Plan de Sistema Digital Integral

*Cubiertas metálicas · Techos · Fachadas · Láminas · Paneles · Ojalatera*

Documento de planificación técnica y funcional — Versión 1.0 — Junio 2026

---

## 1. Resumen ejecutivo

Mundo Cubiertas es una empresa establecida en el sector de cubiertas metálicas, techos, fachadas y materiales afines (láminas metálicas, láminas de UPVC, paneles, sistemas de cubierta y ojalatera). Actualmente gestiona sus ventas, cotizaciones y seguimiento de clientes en hojas de cálculo Excel, lo que limita la eficiencia operativa y la capacidad de escalar el negocio.

Este documento describe el plan completo para construir un sistema digital integral que incluye:

- Una página web pública tipo vitrina (catálogo sin carrito de compras)
- Un sistema de cotizaciones con base de datos y generación de PDF
- Integración con WhatsApp mediante links directos y un bot automatizado
- Un CRM básico para historial de clientes y seguimiento de ventas
- Módulos adicionales de inventario, compras en línea y redes sociales en fases posteriores

El sistema está diseñado para reemplazar gradualmente el uso de Excel y centralizar todas las operaciones de venta en una sola plataforma administrable.

---

## 2. Objetivos del sistema

### 2.1 Objetivo general

Desarrollar una plataforma web integral para Mundo Cubiertas que digitalice y automatice los procesos de vitrina de productos, cotización, seguimiento de clientes y comunicación vía WhatsApp, sustituyendo el control manual en Excel.

### 2.2 Objetivos específicos

- Presentar el catálogo de productos de forma profesional y accesible desde cualquier dispositivo
- Permitir a los clientes solicitar cotizaciones indicando si cuentan o no con planos del proyecto
- Generar cotizaciones en PDF de forma automática y mantener su historial en base de datos
- Proveer accesos directos a WhatsApp por producto y por vendedor
- Automatizar la toma de órdenes y consultas mediante un bot de WhatsApp
- Migrar el historial de clientes y ventas desde Excel a una base de datos relacional
- Habilitar compras en línea y control de inventario en fases posteriores

---

## 3. Módulos del sistema

El sistema se compone de 8 módulos principales. Se implementarán en fases según prioridad y presupuesto disponible.

| # | Módulo | Descripción | Prioridad |
|---|--------|-------------|-----------|
| 1 | Catálogo de productos | Vitrina web de cubiertas, láminas, paneles y accesorios sin carrito de compras. Filtros por tipo de producto y marca. | Alta |
| 2 | Cotizaciones | Generación de cotizaciones con opción de indicar si el cliente tiene planos (sube archivo) o no. Seguimiento de estado y PDF exportable. | Alta |
| 3 | Integración WhatsApp | Botones de link directo (wa.me) por producto y por vendedor. Mensaje pre-llenado con nombre del producto al hacer clic. | Alta |
| 4 | Bot de ventas / Chat | Chatbot que toma órdenes, guarda sugerencias y consultas. Conectado a WhatsApp Business API. Flujo distinto si cliente tiene o no planos. | Media |
| 5 | Compras en línea | Pasarela de pagos, carrito y checkout para pedidos directos desde la web. | Media |
| 6 | Control de inventario | Módulo admin para gestionar stock de láminas, paneles y accesorios. Alertas de mínimo de stock. | Media |
| 7 | Historial de clientes (CRM) | Base de datos de clientes con historial de cotizaciones, compras y conversaciones. Migración desde Excel. | Alta |
| 8 | Redes sociales | Integración de feed de Instagram/Facebook. Publicación programada y seguimiento de métricas básicas. | Baja |

### 3.1 Flujo detallado: Cotizaciones (con y sin planos)

Este flujo es uno de los diferenciadores clave del sistema. El cliente inicia la solicitud desde la web o WhatsApp y se le pregunta si cuenta con planos del proyecto.

#### Ruta A: Cliente CON planos

1. El cliente selecciona productos del catálogo
2. Indica que tiene planos y sube el archivo (PDF, DWG, imagen)
3. El sistema crea una cotización en estado `pendiente_revision`
4. Un vendedor revisa los planos y ajusta la cotización manualmente en el panel admin
5. Se genera PDF y se envía al cliente por email y/o WhatsApp

#### Ruta B: Cliente SIN planos

1. El cliente selecciona productos y cantidades estimadas
2. El sistema genera una cotización automática con precios de referencia
3. Se le indica que los precios pueden variar y que puede solicitar una visita técnica
4. El vendedor puede ajustar y reenviar la cotización finalizada

#### Estados de una cotización

| Estado | Descripción |
|--------|-------------|
| `borrador` | En construcción por el cliente o vendedor |
| `enviada` | El cliente recibió la cotización |
| `aceptada` | El cliente confirmó y se genera la orden |
| `rechazada` | El cliente no procede |
| `expirada` | Sin respuesta después de N días configurables |

### 3.2 Bot de WhatsApp: flujo de atención

El bot funciona sobre WhatsApp Business API. Responde automáticamente fuera de horario y puede transferir a un agente humano en cualquier momento.

#### Flujo principal del bot

1. Saludo y menú: el bot pregunta el motivo de contacto
   - 1. Solicitar cotización
   - 2. Consultar estado de cotización existente
   - 3. Información de productos
   - 4. Hablar con un vendedor
2. Si el cliente elige cotización: pregunta si tiene planos (SI/NO)
3. **Con planos:** solicita que envíe el archivo por WhatsApp y crea el registro
4. **Sin planos:** solicita tipo de cubierta, metros estimados y uso (bodega, casa, industrial)
5. El bot guarda todos los datos en la base de datos y notifica al vendedor asignado
6. Fuera de horario: el bot recibe y registra la consulta, responde al día siguiente

---

## 4. Stack tecnológico recomendado

| Capa | Tecnología recomendada | Razón |
|------|------------------------|-------|
| Frontend | Next.js 14 (React) | SSR/SEO para catálogo público, rápido y moderno |
| Backend / API | Node.js + NestJS | API REST para cotizaciones, clientes e inventario |
| Base de datos | PostgreSQL | Relacional, ideal para cotizaciones, clientes e inventario |
| ORM | Prisma | Migraciones limpias, fácil de mantener |
| Autenticación | NextAuth.js / JWT | Panel admin seguro con roles |
| Bot WhatsApp | WhatsApp Business API + Baileys o Twilio | Toma de órdenes y respuestas automáticas |
| Storage archivos | AWS S3 o Cloudflare R2 | PDFs de cotizaciones y planos subidos por clientes |
| Hosting | Vercel (frontend) + Railway o Render (backend) | Despliegue sencillo, escalable, bajo costo inicial |
| Panel admin | React Admin o dashboard propio | Gestión de productos, cotizaciones, clientes e inventario |
| Email | Resend o SendGrid | Envío automático de cotizaciones en PDF |

### 4.1 Consideraciones de arquitectura

- El sistema se divide en frontend público (vitrina) y panel de administración privado
- La API REST separa la lógica de negocio del frontend, facilitando futuras apps móviles
- La base de datos PostgreSQL permite relaciones complejas entre clientes, cotizaciones e inventario
- El bot de WhatsApp corre como un microservicio independiente que escribe en la misma BD
- Los archivos (planos, PDFs de cotizaciones) se almacenan en S3 o R2, no en el servidor

---

## 5. Diseño de base de datos

Esquema relacional para PostgreSQL. Todas las tablas incluyen campos `created_at` y `updated_at` con timestamps automáticos.

| Tabla / Entidad | Campos principales |
|-----------------|-------------------|
| `productos` | id, nombre, categoria, descripcion, precio_referencia, unidad, imagen_url, stock_actual, stock_minimo, activo |
| `clientes` | id, nombre, empresa, email, telefono, tiene_planos (bool), notas, fecha_registro |
| `cotizaciones` | id, cliente_id, fecha, estado, tiene_planos, url_planos, total, pdf_url, notas |
| `cotizacion_items` | id, cotizacion_id, producto_id, cantidad, unidad, precio_unitario, subtotal |
| `ordenes` | id, cliente_id, canal (web/whatsapp/bot), estado, total, fecha |
| `inventario_movimientos` | id, producto_id, tipo (entrada/salida), cantidad, motivo, fecha, usuario_id |
| `conversaciones` | id, cliente_id, canal (whatsapp/web), fecha_inicio, resumen |
| `mensajes` | id, conversacion_id, rol (user/bot/agente), contenido, fecha |
| `usuarios_admin` | id, nombre, email, rol (admin/vendedor/inventario), password_hash |

### 5.1 Migración desde Excel

- Exportar cada hoja de Excel a CSV
- Crear un script de importación que mapee las columnas de Excel a los campos de la BD
- Limpiar y normalizar datos (teléfono, email, nombres de productos)
- Importar primero clientes, luego productos, luego cotizaciones históricas
- Período de transición: 2 semanas usando ambos sistemas en paralelo
- Capacitación del equipo en el nuevo panel admin antes de desactivar Excel

---

## 6. Plan de fases y cronograma

| Fase | Tiempo | Nombre | Entregables clave |
|------|--------|--------|-------------------|
| Fase 1 | Semanas 1-2 | MVP público | Catálogo de productos, links de WhatsApp por producto, formulario de cotización básico (con/sin planos), landing page |
| Fase 2 | Semanas 3-4 | CRM + Cotizaciones avanzadas | Panel admin con historial de clientes, generación de PDF de cotizaciones, migración de datos desde Excel, envío por email |
| Fase 3 | Mes 2 | Bot + Inventario | Bot de WhatsApp con flujo de toma de órdenes, módulo de inventario con alertas, historial de conversaciones por cliente |
| Fase 4 | Mes 3 | Compras en línea + Redes | Pasarela de pagos, carrito, checkout. Integración de redes sociales. Métricas y reportes de ventas |

### 6.1 Criterios de éxito por fase

**Fase 1 (MVP — semanas 1-2)**
- La vitrina de productos está en línea y es accesible desde celular
- Los links de WhatsApp funcionan correctamente por producto
- Un cliente puede enviar una solicitud de cotización con o sin planos
- El equipo puede ver las solicitudes en el panel admin

**Fase 2 (CRM — semanas 3-4)**
- Los clientes históricos de Excel están importados en la BD
- El vendedor puede generar y enviar un PDF de cotización desde el panel
- El sistema envía el PDF por email automáticamente al aceptar una cotización

**Fase 3 (Bot + Inventario — mes 2)**
- El bot de WhatsApp responde consultas básicas y registra solicitudes
- El módulo de inventario muestra stock actual y genera alertas de mínimo

**Fase 4 (Pagos + Redes — mes 3)**
- Los clientes pueden pagar en línea desde la web
- El feed de redes sociales aparece en la página pública

---

## 7. Roles y permisos del sistema

| Rol | Permisos |
|-----|---------|
| Administrador | Acceso total: productos, cotizaciones, clientes, inventario, usuarios, configuración del bot y reportes |
| Vendedor | Ver y editar cotizaciones, ver historial de clientes, responder conversaciones de WhatsApp. Sin acceso a inventario ni gestión de usuarios |
| Inventario | Gestionar stock, registrar entradas y salidas, ver alertas de mínimo. Sin acceso a cotizaciones ni clientes |
| Cliente (público) | Ver catálogo, enviar solicitud de cotización, hacer seguimiento con número de referencia. Sin login requerido en MVP |

---

## 8. Consideraciones adicionales

### 8.1 Seguridad

- Autenticación con JWT y refresh tokens para el panel admin
- HTTPS obligatorio en producción
- Los archivos de planos son privados: solo accesibles con URL firmada de S3 (expira en 24h)
- Backups automáticos diarios de la base de datos
- Rate limiting en el API para prevenir abuso

### 8.2 Experiencia móvil

- La vitrina pública debe ser 100% responsive (prioridad móvil primero)
- Los links de WhatsApp abren directamente la app en celular
- El formulario de cotización debe funcionar sin cuenta de usuario
- El panel admin debe ser usable desde tablet para vendedores en campo

### 8.3 SEO y visibilidad

- URLs amigables: `/productos/lamina-metalica-r101`
- Metadata de Open Graph para compartir productos en redes sociales
- Sitemap XML generado automáticamente
- Google Analytics o Plausible para medir tráfico

### 8.4 Escalabilidad futura

- La arquitectura permite agregar múltiples empresas o sucursales
- El bot puede expandirse a otros canales: Telegram, Instagram DMs, web chat
- El módulo de cotizaciones puede evolucionar a un ERP ligero
- Se puede agregar una app móvil nativa usando la misma API REST

---

## 9. Próximos pasos inmediatos

- Definir y contratar al equipo de desarrollo (1 fullstack senior o 1 frontend + 1 backend)
- Registrar dominio si no existe (mundocubiertas.com o .cr)
- Crear cuenta de WhatsApp Business y solicitar acceso a WhatsApp Business API (Meta)
- Exportar los datos de Excel actuales para planificar la migración
- Validar el catálogo de productos: lista completa con nombres, categorías y precios de referencia
- Decidir el presupuesto para las fases 1 y 2 para asignar prioridades
- Firmar acuerdo con desarrollador y establecer entregas parciales por semana

### 9.1 Preguntas pendientes de definir

- ¿Cuántos vendedores usarán el panel admin simultáneamente?
- ¿Hay un logo y manual de marca disponible para el diseño?
- ¿Los precios de productos son públicos o solo visibles tras solicitar cotización?
- ¿Cuál es el número de WhatsApp Business oficial que se usará para el bot?
- ¿Qué pasarela de pagos se prefiere para la Fase 4 (Stripe, PayPal, SINPE Móvil)?

---

## 10. Arquitectura de agentes con Claude Code

El proyecto se desarrollará usando Claude Code, el entorno agente de Anthropic que opera directamente en la terminal, el sistema de archivos y las herramientas de desarrollo. En lugar de tener un único agente haciendo todo, el sistema se organiza como un equipo de agentes especializados, cada uno responsable de un segmento específico de la aplicación. Esto permite trabajo paralelo, contextos más limpios y menor riesgo de errores entre capas.

### 10.1 Conceptos clave de Claude Code

**Subagentes** — Se definen como archivos Markdown en `.claude/agents/`. El agente principal los invoca con la herramienta `Agent()` para delegar tareas enfocadas. Cada subagente corre en su propio contexto aislado con herramientas específicas. Solo el mensaje final regresa al agente padre, manteniendo limpio el contexto principal.

**Agent Teams** — Funcionalidad experimental para coordinar múltiples instancias de Claude Code en paralelo. Un agente líder coordina el trabajo a través de una lista de tareas compartida; los teammates trabajan independientemente y se comunican entre sí. Se habilita con `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` en `settings.json`.

**CLAUDE.md y Skills** — `CLAUDE.md` es el archivo de instrucciones persistentes que todos los agentes leen al inicio de cada sesión. Los Skills son archivos `SKILL.md` que encapsulan flujos de trabajo reutilizables (`/deploy`, `/review-pr`, `/seed-db`, etc.).

### 10.2 Agentes especializados para Mundo Cubiertas

| Agente | Archivo | Responsabilidades | Herramientas |
|--------|---------|-------------------|--------------|
| Orquestador | (sesión principal) | Coordina el equipo, descompone tareas, delega, sintetiza resultados | Todas (Agent, Read, Bash) |
| Backend | `backend.md` | API REST en NestJS: endpoints de productos, cotizaciones, clientes, auth, inventario | Read, Edit, Write, Bash — solo `/backend` |
| Frontend | `frontend.md` | Vitrina pública en Next.js: catálogo, detalle de producto, formulario de cotización, links WhatsApp | Read, Edit, Write, Bash — solo `/frontend` |
| Database | `database.md` | Migraciones Prisma, seed de datos, script importación desde Excel, optimización de queries | Read, Edit, Write, Bash — solo `/prisma` y `/scripts` |
| WhatsApp/Bot | `whatsapp-bot.md` | Microservicio del bot: flujos de conversación, integración con WhatsApp Business API, manejo de planos | Read, Edit, Write, Bash — solo `/bot` |
| QA/Testing | `qa-tester.md` | Tests unitarios, de integración y e2e. Valida flujos críticos: cotización con/sin planos, auth | Read, Edit, Write, Bash — sin acceso a `/prisma` |
| DevOps | `devops.md` | Docker, variables de entorno, despliegue en Vercel y Railway, backups, CI/CD | Read, Edit, Bash — acceso amplio |
| Revisor | `code-reviewer.md` | Revisión de código antes de commits: seguridad, performance, cobertura de tests. Solo lectura | Read, Grep, Glob — sin Edit ni Write |

### 10.3 Estructura de archivos del proyecto

```
mundo-cubiertas/
├── .claude/
│   ├── CLAUDE.md                    # instrucciones globales para todos los agentes
│   ├── settings.json                # config de Claude Code (habilita Agent Teams)
│   ├── agents/
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   ├── whatsapp-bot.md
│   │   ├── qa-tester.md
│   │   ├── devops.md
│   │   └── code-reviewer.md
│   └── skills/
│       ├── deploy-staging/SKILL.md
│       ├── seed-database/SKILL.md
│       ├── review-pr/SKILL.md
│       └── import-excel/SKILL.md
├── backend/                         # Node.js / NestJS API
├── frontend/                        # Next.js vitrina pública
├── admin/                           # Panel de administración
├── bot/                             # Microservicio WhatsApp
├── prisma/                          # Esquema BD y migraciones
└── scripts/                         # Importación Excel y utilidades
```

### 10.4 Ejemplo: `.claude/agents/backend.md`

```markdown
---
name: backend
description: Usa este agente para todo lo relacionado con la API REST:
  endpoints, validaciones, lógica de negocio, autenticación y servicios
  del servidor. Se activa automáticamente cuando la tarea involucra
  archivos en /backend o cuando se necesita crear o modificar un endpoint.
tools: Read, Edit, Write, Bash
---

Eres el agente especialista en backend para Mundo Cubiertas.
Tu responsabilidad exclusiva es el directorio /backend/.

Tecnologías: Node.js 20, NestJS, Prisma ORM, PostgreSQL, JWT.

Reglas:
- Nunca modifiques archivos fuera de /backend/
- Todos los endpoints deben tener validación con class-validator
- Siempre escribe un test unitario para cada servicio nuevo
- Las rutas de cotización deben manejar los dos flujos:
  con planos (acepta upload de archivo) y sin planos
- Usa el campo tiene_planos: boolean en el schema de cotización
- Los PDF de cotización se generan con @react-pdf/renderer
- Errores HTTP: 400 validación, 401 auth, 403 permisos, 404 no encontrado

Al terminar una tarea, reporta:
1. Archivos creados o modificados
2. Endpoints nuevos con su método y ruta
3. Tests escritos
```

### 10.5 Contenido del `CLAUDE.md` global

```markdown
# Mundo Cubiertas — Reglas globales del proyecto

## Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: NestJS, Prisma, PostgreSQL
- Bot: WhatsApp Business API + Baileys
- Storage: AWS S3 (planos y PDFs)

## Reglas de código
- TypeScript estricto en todo el proyecto (strict: true)
- Nombres en español para variables de dominio (cotizacion, cliente, producto)
- Nombres en inglés para infraestructura (service, controller, module)
- Commits en inglés, issues en español
- Nunca hardcodear credenciales; usar .env y validar con @nestjs/config

## Flujo crítico: cotizaciones
- Siempre preguntar si el cliente tiene_planos (boolean)
- Con planos: subir archivo a S3, guardar URL en cotizaciones.url_planos
- Sin planos: precio de referencia con nota de que puede variar
- Estados válidos: borrador, enviada, aceptada, rechazada, expirada

## Estructura de directorios
Cada agente trabaja solo en su directorio asignado.
No cruzar fronteras entre backend/, frontend/, bot/, prisma/.

## Comandos útiles
- npm run dev            → levantar backend en local
- npm run dev:front      → levantar frontend en local
- npx prisma migrate dev → aplicar migraciones
- npm run test           → correr tests
- /deploy-staging        → desplegar a staging (skill de Claude Code)
```

### 10.6 `settings.json` para habilitar Agent Teams

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "auto",
  "permissions": {
    "allow": ["Read", "Bash(npm run *)", "Bash(npx prisma *)"],
    "deny": ["Bash(rm -rf *)", "Bash(DROP TABLE *)"]
  }
}
```

Con `teammateMode: auto`, dentro de una sesión tmux o iTerm2 cada agente abre su propio panel. En cualquier otra terminal, todos corren en la misma sesión y se navega entre ellos con las flechas del teclado.

### 10.7 Flujo de trabajo con Agent Teams

Ejemplo de prompt para lanzar la Fase 1 completa en paralelo:

```
Spawn 3 teammates para construir el MVP de Mundo Cubiertas en paralelo:
- Agente backend: crea los endpoints GET /productos, POST /cotizaciones
  (con campo tiene_planos), y GET /cotizaciones/:id
- Agente frontend: construye la página de catálogo y el formulario
  de cotización que pregunte si el cliente tiene planos
- Agente database: crea las migraciones Prisma para las tablas
  productos, clientes y cotizaciones según el schema del CLAUDE.md

Requisito plan approval para el agente database antes de ejecutar
cualquier migración.
```

**Flujo de revisión de código:**

1. Agentes backend/frontend/bot terminan su tarea y notifican al orquestador
2. Orquestador invoca al Agente Revisor: "Revisa los cambios en /backend/src/cotizaciones/"
3. Revisor reporta hallazgos (solo lee, no modifica)
4. Si hay problemas, el orquestador los pasa al agente correspondiente para corregir
5. Agente QA ejecuta los tests correspondientes
6. Todo verde: el skill `/deploy-staging` hace el despliegue automáticamente

### 10.8 Limitaciones y buenas prácticas

- **Agent Teams es experimental** — guardar trabajo frecuentemente con `git commit`
- **Costo de tokens** — con 3 agentes activos el consumo es ~3x mayor que una sesión individual
- **Sin edición simultánea del mismo archivo** — la separación por directorio resuelve esto en la mayoría de casos
- **Git worktrees** si dos agentes necesitan trabajar en ramas distintas al mismo tiempo
- **El prompt inicial es crítico** — los subagentes no heredan el historial de conversación; incluir rutas, contexto y criterios de éxito explícitamente
- **Plan approval obligatorio** para el Agente Database antes de cualquier migración en producción

---

*Este documento fue generado como plan de descubrimiento técnico. Las estimaciones de tiempo y costo son referenciales y deben validarse con el equipo de desarrollo seleccionado.*

*Mundo Cubiertas — Plan de Sistema Digital — Junio 2026*
