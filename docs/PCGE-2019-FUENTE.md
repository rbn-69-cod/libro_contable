# Catálogo PCGE de la fuente proporcionada

El archivo [`src/data/pcge-2019.json`](../src/data/pcge-2019.json) fue regenerado a partir de `VERSION_MODIFICADA_PCG_EMPRESARIAL.pdf`, proporcionado por el usuario.

La copia usada para reproducibilidad está en [`PCGE-FUENTE-PROPORCIONADA.pdf`](./PCGE-FUENTE-PROPORCIONADA.pdf). El documento contiene el catálogo ordenado por elemento, incluyendo cuentas de orden `01–09` y el desarrollo del elemento 9.

El dataset contiene 1,790 filas extraídas del documento y 1,800 nodos al sumar las diez raíces 0–9. Incluye códigos, denominaciones, niveles, relaciones padre-hijo, tipo contable y si son hojas habilitadas para movimientos.

La importación evita duplicados y no elimina ni modifica cuentas existentes con movimientos. Las cuentas oficiales se marcan como base del catálogo; las cuentas personalizadas pueden mantenerse separadas por empresa.

Validación reproducible:

```bash
npm run validate:pcge
```
