# Deployment Standards

## Objetivo

Reducir errores de despliegue y dejar claro como promover cambios a produccion con control minimo.

## Flujo recomendado

1. Confirmar que el cambio esta revisado y probado.
2. Verificar variables, accesos y dependencias del ambiente destino.
3. Ejecutar despliegue con ventana y responsable definidos.
4. Validar humo post despliegue.
5. Registrar resultado y rollback si fue necesario.

## Criterios minimos

| Tema | Regla |
| --- | --- |
| Ambientes | Separar al menos desarrollo y produccion cuando el proyecto lo justifique. |
| Responsables | Debe haber una persona asignada al despliegue. |
| Validacion | Definir que se revisa despues de publicar. |
| Rollback | Tener un camino claro para volver atras si falla. |
| Registro | Guardar fecha, version y resultado del despliegue. |

## Checklist de humo

- La aplicacion abre o responde.
- El flujo principal funciona.
- Los errores criticos no aumentaron.
- Las integraciones principales siguen operativas.
