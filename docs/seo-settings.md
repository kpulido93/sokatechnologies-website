# Ajustes SEO minimos

## Objetivo

Dejar la identidad SEO publica de SokaTechnologies sin placeholders visibles en schema y metadatos del entorno WordPress local.

## Origen del schema actual

El schema de organizacion no viene del child theme versionado. En el entorno local sale del plugin SEO activo `siteseo`.

Evidencia tecnica:

- Hook del plugin: `public_html/wp-content/plugins/siteseo/siteseo.php`
  `add_action('wp_head', '\SiteSEO\SocialMetas::add_social_graph', 1);`
- Generacion del JSON-LD: `public_html/wp-content/plugins/siteseo/main/socialmetas.php`
- Campos usados por el plugin:
  - `social_knowledge_type`
  - `social_knowledge_name`
  - `social_accounts_facebook`
  - `social_accounts_twitter`
  - `social_accounts_instagram`
  - `social_accounts_youtube`
  - `social_accounts_pinterest`

Problema detectado en esta version de `siteseo`:

- Cuando `social_accounts_twitter` esta vacio, el plugin construye igual `https://x.com/`.
- Resultado: `sameAs` publica un placeholder aunque no exista una red social real definida.
- Si `social_knowledge_name` esta vacio, `Organization.name` sale vacio.

## Correccion aplicada en el tema

Se aplico un override en el child theme versionado y en el tema local activo para:

- retirar el hook original de `siteseo` que imprime el schema de organizacion;
- volver a imprimir un JSON-LD limpio desde el child theme;
- usar `SokaTechnologies` como fallback si el nombre de organizacion no esta configurado;
- omitir `sameAs` mientras no existan perfiles sociales reales;
- reutilizar el favicon/logo disponible como logo de schema cuando no hay `Site Icon` nativo configurado.

Archivos del override:

- `wp-theme/sokatechnologies-child-theme/functions.php`
- `public_html/wp-content/themes/sokatechnologies/functions.php`

## Configuracion manual recomendada en WordPress Admin

Ruta exacta:

1. Ir a `SiteSEO -> Social`.
2. En `Knowledge Graph`:
   - `Person or organization`: `Organization`
   - `Your name/organization`: `SokaTechnologies`
   - `Your photo/organization logo`: cargar el logo oficial cuando exista una version final adecuada
3. En `Your social accounts`:
   - dejar vacios Facebook, X, Instagram, YouTube y Pinterest mientras no existan perfiles reales
   - no inventar URLs ni usernames
4. Guardar cambios.

## Identidad publica minima aprobada

- Organizacion: `SokaTechnologies`
- Sitio local: `http://127.0.0.1:8088`
- Correo publico: `info@sokatechnologies.com`
- Pais principal: `Colombia`
- Region objetivo: `Latinoamerica`

Nota:

- El correo, pais y region objetivo quedan documentados aqui como referencia de configuracion SEO basica y consistencia editorial.
- Esta version local del schema no inventa redes sociales ni telefonos no publicados.

## Validacion

Comprobar en local:

1. Abrir `http://127.0.0.1:8088/`.
2. Revisar el `application/ld+json` de organizacion.
3. Confirmar:
   - `\"name\":\"SokaTechnologies\"`
   - no aparece `https://x.com/`
   - no aparece `sameAs` si no hay perfiles reales

Comandos utiles:

- `curl http://127.0.0.1:8088/`
- `wp option get siteseo_social_option_name --format=json`

## Pendientes

- Sustituir el logo de schema por el lockup/logo final cuando exista asset definitivo para SEO.
- Si en el futuro se publica una red social real, agregar solo la URL oficial correspondiente en `SiteSEO -> Social`.
- Revalidar el HTML publico tras actualizar el plugin `siteseo`, porque el bug de `x.com/` podria cambiar entre versiones.
