# Guia visual de SokaTechnologies

Esta guia define la base visual para aplicar la identidad de SokaTechnologies en WordPress, assets, snippets CSS y child theme.

## Concepto

SokaTechnologies es una marca B2B tecnologica, sobria, confiable y moderna.

Concepto rector:

> Tecnologia clara para operaciones empresariales reales.

La web debe comunicar criterio tecnico, orden operativo y capacidad de ejecucion sin caer en estetica gaming, futurismo exagerado ni fotografia corporativa generica.

## Paleta

| Token | Uso | Color |
|---|---|---|
| Azul oscuro principal | Fondos de alta jerarquia, header, footer, bloques oscuros | `#07111F` |
| Azul petroleo | Fondos secundarios oscuros, bandas tecnicas | `#0B2438` |
| Azul tecnologico | CTAs, enlaces destacados, estados activos | `#2563EB` |
| Azul hover | Hover y focus de acciones principales | `#1D4ED8` |
| Cian tecnico | Acentos puntuales, indicadores, detalles | `#14B8A6` |
| Fondo claro | Fondos generales o alternancia de secciones | `#F8FAFC` |
| Blanco | Tarjetas, fondos internos y texto sobre oscuro | `#FFFFFF` |
| Texto principal | Titulos y cuerpo principal | `#0F172A` |
| Texto secundario | Descripciones, ayudas y metadatos | `#475569` |
| Bordes suaves | Bordes, separadores y contornos | `#CBD5E1` |

Reglas:

- Usar el azul tecnologico para acciones principales.
- Usar el azul hover solo para estados interactivos.
- Usar el cian tecnico como acento, no como color dominante.
- Mantener fondos claros en contenido denso.
- Reservar fondos oscuros para bloques de alta jerarquia o cierre.

## Tipografia

Fuente principal:

- Inter.

Fallback:

- `-apple-system`
- `BlinkMacSystemFont`
- `"Segoe UI"`
- `Roboto`
- `Arial`
- `sans-serif`

Reglas:

- Mantener jerarquia clara entre H1, H2, H3, cuerpo y texto auxiliar.
- Evitar mas de dos pesos visuales en una misma seccion.
- No usar mayusculas largas.
- Priorizar legibilidad en movil.
- No usar texto secundario demasiado pequeno.

## Logo e isotipo

- Logo recomendado: isotipo basado en una S modular tecnologica.
- Mantener versiones para fondos claros y oscuros.
- No reconstruir el logo final sin una tarea especifica de diseno.
- No deformar, rotar ni aplicar efectos al logo.
- No usar sombras, brillos o degradados que cambien la percepcion de marca.

## Botones

### Primario

Uso:

- CTA principal de Home.
- CTA de contacto.
- Accion principal de formularios.

Estilo:

- Fondo `#2563EB`.
- Hover `#1D4ED8`.
- Texto blanco.
- Radio moderado.
- Focus visible.
- Altura tactil minima de 44 px.

### Secundario

Uso:

- Acciones alternativas.
- Enlaces a servicios, casos o informacion adicional.

Estilo:

- Fondo blanco o transparente.
- Borde `#CBD5E1`.
- Texto `#0F172A` o `#2563EB`.
- Hover claro y legible.

Evitar:

- Mas de un CTA primario por bloque visual.
- Botones con texto demasiado largo.
- Botones sin hover o focus.
- Colores fuera de paleta.

## Tarjetas

Uso:

- Servicios.
- Beneficios.
- Casos anonimizados.
- Bloques de proceso.

Reglas:

- Fondo blanco.
- Borde suave.
- Radio maximo moderado.
- Padding consistente.
- Icono o etiqueta opcional.
- Titulo concreto.
- Texto breve y accion opcional.
- Grillas que pasen a una columna en movil.

## Formularios

Reglas:

- Pedir solo campos necesarios.
- Usar labels visibles.
- Mantener focus claro.
- Mostrar errores cerca del campo.
- Incluir referencia de privacidad cuando se recolectan datos personales.
- No pedir contrasenas, documentos ni informacion confidencial.

Campos base:

- Nombre.
- Empresa.
- Email.
- Necesidad o mensaje.

## Secciones

Reglas:

- Cada seccion debe responder una pregunta concreta.
- Alternar fondos claros y blancos para mejorar lectura.
- Usar bloques oscuros solo cuando aporten jerarquia.
- Mantener ancho maximo de lectura.
- Evitar secciones decorativas sin contenido util.

## Estilo de imagenes

Usar:

- Composiciones tecnicas sobrias.
- Interfaces anonimizadas.
- Diagramas o sistemas abstractos claros.
- Imagenes optimizadas y con licencia.

Evitar:

- Fotos corporativas genericas.
- Estetica gaming.
- Neon excesivo.
- Futurismo exagerado.
- Personas identificables sin autorizacion.
- Capturas reales de clientes.
- Logos o metricas no aprobadas.

## Iconografia

- Usar SVG.
- Mantener grosor visual consistente.
- Preferir `currentColor`.
- No mezclar estilos outline y filled sin decision documentada.
- Evitar iconos decorativos sin funcion.

## Casos anonimizados

Estructura recomendada:

1. Sector o tipo de organizacion sin identificar al cliente.
2. Problema operativo.
3. Solucion aplicada.
4. Resultado cualitativo o metrica aprobada.
5. Tecnologias solo si ayudan a entender el valor.

No incluir nombres, logos, dominios, usuarios, emails, tickets, capturas reales ni datos de negocio.

## Que evitar

- Plugins visuales innecesarios para resolver CSS basico.
- Cambios directos en WordPress core.
- Estilos globales que rompan el admin.
- Gradientes dominantes o efectos decorativos excesivos.
- Secciones con demasiado texto sin jerarquia.
- Testimonios, logos o casos reales sin autorizacion.
- Cambios hechos solo en `public_html/` sin migracion al child theme versionado cuando deban conservarse.
