# Skill: seed-database

Ejecuta el seed de datos de prueba en la base de datos local.

## Uso
```
/seed-database
```

## Pasos

1. Verificar que PostgreSQL este corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar que las migraciones esten aplicadas:
   ```bash
   npx prisma migrate status
   ```
   Si hay migraciones pendientes: `npx prisma migrate dev`

3. Ejecutar el seed:
   ```bash
   npx prisma db seed
   ```

4. Verificar que los datos se crearon:
   ```bash
   npx prisma studio
   ```
   Abrir http://localhost:5555 y revisar las tablas Producto y Cliente.

## Datos de prueba incluidos

El seed crea en `prisma/seed.ts`:
- 6 productos de ejemplo (laminas metalicas, paneles, accesorios)
- 2 clientes de prueba (uno con planos, uno sin planos)
- 1 cotizacion en estado borrador

## Notas
- El seed usa `upsert` para no duplicar datos si se corre mas de una vez
- Para limpiar la BD completamente: `npx prisma migrate reset` (pide confirmacion)
