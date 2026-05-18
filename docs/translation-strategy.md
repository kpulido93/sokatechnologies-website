# Estrategia de traduccion ES/EN

## Objetivo

Preparar la web de SokaTechnologies para operar en espanol e ingles dentro de WordPress, usando TranslatePress en el entorno local y sin duplicar contenido manualmente dentro del repositorio.

Este documento deja el estado real del local y los pasos manuales pendientes para completar la configuracion desde WordPress Admin.

## Idiomas

| Rol | Idioma | Codigo recomendado | Estado |
| --- | --- | --- | --- |
| Idioma principal | Espanol | `es_ES` | Idioma base del contenido actual. |
| Idioma secundario | Ingles | `en_US` | Idioma objetivo para traduccion comercial. |

El repositorio sigue manteniendo el contenido fuente en espanol. La capa EN debe gestionarse desde WordPress con TranslatePress.

## Plugin aprobado

Plugin aprobado: **TranslatePress - Translate Multilingual sites with AI Translation** (`translatepress-multilingual`).

Motivo:

- Permite traducir visualmente desde WordPress.
- Mantiene una sola fuente de contenido.
- Soporta rutas por idioma.
- Evita duplicar paginas manualmente.
- Permite activar ingles por fases.

## Estado actual local

Verificacion realizada en `http://127.0.0.1:8088` el `2026-05-18`:

- `wp --info` funciona en el WordPress local.
- TranslatePress quedo instalado y activo solo en local.
- `wp option get trp_settings --format=json` muestra `es_ES` como idioma por defecto.
- Aun no existe un segundo idioma publicado en TranslatePress.
- `http://127.0.0.1:8088/en/` sigue respondiendo `404`.

Decision aplicada en el tema:

- El selector de idioma debe permanecer oculto mientras TranslatePress no tenga un segundo idioma real configurado.
- No se deben mostrar enlaces a `/en/` ni botones `ES | EN` hasta que `/en/` responda correctamente.
- No se activaron servicios de traduccion automatica ni funciones pagas.

## Configuracion manual pendiente en WordPress Admin

Ruta exacta:

1. Ir a `Ajustes -> TranslatePress`.
2. En `General`, confirmar `Default Language = Espanol (es_ES)`.
3. En `All Languages`, agregar `English (United States)` como idioma secundario.
4. Guardar cambios.
5. Confirmar que el slug de ingles queda en `en` para que la URL use `/en/`.
6. Mantener `Use subdirectory for default language` desactivado para conservar espanol en `/`.
7. Mantener desactivada cualquier opcion de traduccion automatica que requiera API key o plan pago.
8. Abrir `http://127.0.0.1:8088/en/` y confirmar que ya no responde `404`.
9. Solo despues de eso, habilitar un selector de idioma real conectado a TranslatePress.

## Selector de idioma

Regla actual:

- No mostrar selector de idioma mientras no exista una segunda lengua publicada.

Implementacion recomendada cuando `/en/` funcione:

1. Mantener el idioma principal en `/`.
2. Mantener ingles en `/en/`.
3. Usar un selector compacto `ES` / `EN` en el header.
4. Agregar un respaldo en footer solo si no recarga demasiado la interfaz.
5. No usar placeholders ni enlaces falsos.

Recomendacion para TranslatePress:

- Mantener desactivado el `Language Switcher Floating` hasta validar que la segunda lengua funciona.
- Si se activa luego, revisar que no choque con el CTA de Contacto ni con el footer.

## URLs esperadas

| Pagina | Espanol | Ingles esperado |
| --- | --- | --- |
| Inicio | `/` | `/en/` |
| Servicios | `/servicios/` | `/en/services/` o `/en/servicios/` |
| Soluciones | `/soluciones/` | `/en/solutions/` o `/en/soluciones/` |
| Casos de exito | `/casos-de-exito/` | `/en/success-stories/` o `/en/casos-de-exito/` |
| Sobre nosotros | `/sobre-nosotros/` | `/en/about-us/` o `/en/sobre-nosotros/` |
| Contacto | `/contacto/` | `/en/contact/` o `/en/contacto/` |

Decision recomendada:

- Usar slugs traducidos si la configuracion final de TranslatePress lo permite.
- Si no, aceptar slugs espanoles dentro de `/en/` sin duplicar paginas manualmente.

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

## Criterios de traduccion

- Mantener tono B2B sobrio y claro.
- Priorizar claridad comercial sobre traduccion literal.
- No inventar clientes, certificaciones, ubicaciones o experiencia no documentada.
- No traducir nombres de marca salvo que exista version oficial.
- Mantener advertencias de no compartir credenciales ni informacion sensible.
- Revisar CTAs para que suenen naturales en ingles.

CTAs sugeridos:

| Espanol | Ingles |
| --- | --- |
| Solicitar diagnostico | Request a diagnostic review |
| Agendar diagnostico | Schedule a diagnostic review |
| Ver servicios | View services |
| Solicitar diagnostico por WhatsApp | Request a diagnostic review via WhatsApp |
| Enviar correo | Send email |

## Checklist manual de activacion

- [x] Verificar WP-CLI en local.
- [x] Instalar y activar TranslatePress solo en local.
- [x] Confirmar que no se toco produccion.
- [x] Mantener oculto el selector mientras `/en/` no funcione.
- [ ] Configurar `English (United States)` como idioma secundario en TranslatePress.
- [ ] Confirmar que `/en/` responde `200`.
- [ ] Habilitar selector real de idioma.
- [ ] Traducir Inicio.
- [ ] Traducir Servicios.
- [ ] Traducir Contacto.
- [ ] Revisar desktop y movil en ambos idiomas.

## Checklist de QA

- [ ] `/` carga en espanol.
- [ ] `/en/` carga en ingles.
- [ ] El selector cambia de idioma sin romper layout.
- [ ] Header y footer se mantienen legibles en ambos idiomas.
- [ ] Los botones principales siguen visibles y claros.
- [ ] El formulario de Contacto mantiene campos y mensajes entendibles en ingles.
- [ ] No aparecen enlaces rotos hacia `/en/`.
- [ ] No se modifico `public_html/wp-config.php`.

## Pendientes antes de publicar EN

- Completar la configuracion manual de TranslatePress en Admin.
- Confirmar si los slugs ingleses seran traducidos o si se mantendran slugs espanoles bajo `/en/`.
- Revisar compatibilidad con cache, SEO y sitemap despues de activar ingles.
- Validar traducciones con una persona responsable del tono comercial.
