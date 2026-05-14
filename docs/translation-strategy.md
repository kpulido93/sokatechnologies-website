# Estrategia de traduccion ES/EN

## Objetivo

Definir una estrategia inicial para publicar la web de SokaTechnologies en espanol e ingles dentro de WordPress, sin duplicar contenido manualmente en el repositorio ni instalar plugins desde Codex.

Este documento es una guia para implementacion manual desde WordPress Admin en un entorno aprobado.

## Idiomas

| Rol | Idioma | Codigo recomendado | Estado |
| --- | --- | --- | --- |
| Idioma principal | Espanol | `es` | Base del contenido actual. |
| Idioma secundario | Ingles | `en` | Traduccion comercial priorizada. |

El contenido fuente del repositorio se mantiene en espanol. Las traducciones inglesas deben gestionarse desde WordPress con el plugin aprobado, no como una segunda copia HTML dentro de `content/`.

## Plugin recomendado

Plugin recomendado: **TranslatePress**.

Motivo:

- Permite traducir desde una interfaz visual en WordPress.
- Mantiene el contenido base en el idioma principal.
- Permite URLs por idioma.
- Evita duplicar paginas manualmente.
- Permite publicar traducciones por fases.

No instalar TranslatePress desde Codex ni desde scripts del repositorio. La instalacion debe hacerse manualmente desde WordPress Admin en el entorno aprobado.

## URLs esperadas

Estrategia recomendada: mantener espanol como idioma por defecto y usar prefijo para ingles.

| Pagina | Espanol | Ingles esperado |
| --- | --- | --- |
| Inicio | `/` | `/en/` |
| Servicios | `/servicios/` | `/en/services/` o `/en/servicios/` segun configuracion final de slugs |
| Soluciones | `/soluciones/` | `/en/solutions/` o `/en/soluciones/` |
| Casos de exito | `/casos-de-exito/` | `/en/success-stories/` o `/en/casos-de-exito/` |
| Sobre nosotros | `/sobre-nosotros/` | `/en/about-us/` o `/en/sobre-nosotros/` |
| Contacto | `/contacto/` | `/en/contact/` o `/en/contacto/` |
| Politica de privacidad | `/politica-privacidad/` | `/en/privacy-policy/` o `/en/politica-privacidad/` |
| Terminos de uso | `/terminos-uso/` | `/en/terms-of-use/` o `/en/terminos-uso/` |

Decision recomendada:

- Usar slugs traducidos para paginas principales si TranslatePress y el plan instalado lo permiten.
- Si la version instalada no permite traducir slugs, aceptar slugs espanoles bajo `/en/` y traducir contenido visible.
- No crear paginas duplicadas manualmente solo para cambiar slugs.

## Selector de idioma

Ubicacion recomendada:

1. Header principal, al final del menu, con opciones cortas `ES` y `EN`.
2. Footer, columna Empresa o Contacto, como respaldo para usuarios que lleguen al final de la pagina.

Reglas visuales:

- Mantener el selector compacto.
- No desplazar CTAs principales.
- No usar banderas como unico indicador; preferir texto `ES` / `EN`.
- Verificar que el selector funcione en desktop y movil.

Implementacion visual preparada:

- `wp-theme/sokatechnologies-child-theme/parts/header.html` incluye un selector pasivo `ES | EN`.
- `ES` aparece como idioma activo.
- `EN` aparece como opcion visual deshabilitada.
- El selector no usa enlaces para evitar apuntar a URLs inglesas que todavia no existen.
- La logica real de cambio de idioma debe reemplazarse o conectarse con TranslatePress desde WordPress Admin.
- Cuando TranslatePress este activo y `/en/` exista, se debe validar si conviene usar el selector del plugin o adaptar el markup del tema.

## Paginas a traducir primero

Prioridad 1:

1. Inicio.
2. Servicios.
3. Contacto.

Prioridad 2:

4. Sobre nosotros.
5. Casos de exito.
6. Soluciones.

Prioridad 3:

7. Politica de privacidad.
8. Terminos de uso.
9. Paginas de servicios especificos si se publican como paginas independientes.

Motivo: Inicio, Servicios y Contacto cubren propuesta de valor, oferta y conversion. Las paginas legales deben traducirse despues de validar textos legales definitivos.

## Que no traducir todavia

No traducir en la primera fase:

- Borradores de blog.
- Documentacion interna.
- Checklists tecnicos del repositorio.
- Snippets.
- Prompts de Codex.
- Casos de exito no aprobados.
- Contenido legal pendiente de revision.
- Textos de plugins que no esten visibles al publico.
- Mensajes internos de administracion de WordPress.
- Configuraciones tecnicas, nombres de campos internos o slugs usados solo por scripts locales.

## Criterios de traduccion

- Mantener tono B2B sobrio y claro.
- Priorizar claridad comercial sobre traduccion literal.
- No inventar clientes, certificaciones, ubicaciones o experiencia no documentada.
- No traducir nombres de producto o marca salvo que exista version oficial.
- Mantener advertencias de no enviar credenciales ni informacion sensible.
- Revisar CTAs para que suenen naturales en ingles.

CTAs sugeridos:

| Espanol | Ingles |
| --- | --- |
| Solicitar diagnostico | Request a diagnostic review |
| Agendar diagnostico | Schedule a diagnostic review |
| Ver servicios | View services |
| Solicitar diagnostico por WhatsApp | Request a diagnostic review via WhatsApp |
| Enviar correo | Send email |

## Checklist de implementacion manual

- [ ] Confirmar que el sitio base esta completo en espanol.
- [ ] Hacer backup del entorno aprobado antes de instalar plugins.
- [ ] Instalar TranslatePress desde WordPress Admin.
- [ ] Configurar espanol como idioma principal.
- [ ] Configurar ingles como idioma secundario.
- [ ] Confirmar estructura de URL para ingles.
- [ ] Revisar el selector visual `ES | EN` del header.
- [ ] Reemplazar o conectar el selector visual con la logica real de TranslatePress.
- [ ] Agregar selector de idioma al footer si aplica.
- [ ] Traducir Inicio.
- [ ] Traducir Servicios.
- [ ] Traducir Contacto.
- [ ] Revisar CTAs en ingles.
- [ ] Revisar mensajes de confidencialidad en ingles.
- [ ] Probar navegacion ES/EN en desktop.
- [ ] Probar navegacion ES/EN en movil.
- [ ] Confirmar que no se crean paginas duplicadas innecesarias.
- [ ] Confirmar que no se agregaron credenciales, tokens ni configuraciones sensibles al repositorio.
- [ ] Documentar cualquier decision de slugs si difiere de esta estrategia.

## Checklist de QA

- [ ] `/` carga en espanol.
- [ ] `/en/` carga en ingles.
- [ ] El selector cambia de idioma sin romper layout.
- [ ] Header y footer se mantienen legibles en ambos idiomas.
- [ ] Los botones principales siguen visibles y claros.
- [ ] El formulario de Contacto mantiene campos y mensajes entendibles en ingles.
- [ ] WhatsApp mantiene numero limpio y mensaje prellenado revisado.
- [ ] No aparecen textos mixtos ES/EN en secciones principales.
- [ ] No se tradujeron datos tecnicos internos ni contenido no aprobado.
- [ ] No se modifico `public_html/wp-config.php`.

## Pendientes antes de produccion

- Revisar traducciones con una persona responsable de tono comercial.
- Revisar paginas legales antes de traducirlas o publicarlas en ingles.
- Confirmar si se usaran slugs traducidos o slugs espanoles bajo `/en/`.
- Confirmar compatibilidad con cache, SEO y sitemap despues de activar TranslatePress.
