# Snippets PHP Seguros

## Uso

Estos snippets son ejemplos para revisión manual. No deben aplicarse directamente en producción sin probarlos antes.

## Reglas

- Usar prefijo `soka_` para funciones propias.
- Proteger acceso directo con `ABSPATH` cuando el snippet viva en un archivo PHP.
- Mantener cada snippet pequeño y reversible.
- Documentar dónde se aplicó y cómo retirarlo.
- No incluir credenciales, tokens, rutas del hosting ni datos internos.

## Plantilla recomendada

```php
<?php
/**
 * Describir el objetivo del snippet.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function soka_example_snippet() {
	// Implementar solo lógica pequeña y probada.
}
```

## Pendientes

- Definir si los snippets PHP se gestionarán desde el child theme o desde un plugin específico aprobado.
- Probar cualquier snippet en staging antes de producción.
