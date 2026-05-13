# Checklist de Instalación cPanel

## Preparación

- Confirmar dominio o subdominio autorizado.
- Confirmar responsable de la instalación.
- Confirmar que no se documentarán credenciales ni rutas reales en el repositorio.
- Revisar disponibilidad de SSL/TLS.
- Revisar política de backups del hosting.

## WordPress

- Instalar WordPress con WP Toolkit o Softaculous.
- Configurar idioma, zona horaria y enlaces permanentes.
- Crear usuarios nominales con roles mínimos.
- Eliminar contenido de ejemplo si no se usará.
- Activar HTTPS.

## PHP y base de datos

- Seleccionar una versión PHP soportada desde MultiPHP Manager.
- Confirmar que MySQL está disponible.
- Evitar guardar nombres reales de base de datos o usuarios en documentación del repo.
- Usar phpMyAdmin solo con backup previo para cambios manuales.

## Tema

- Instalar el tema padre desde WordPress.
- Confirmar la carpeta real del tema padre.
- Preparar el child theme con el `Template` correcto.
- Probar activación en staging o entorno seguro.

## Cierre

- Confirmar que el sitio carga por HTTPS.
- Confirmar que los backups están activos.
- Documentar decisiones relevantes en `docs/decisions.md`.
