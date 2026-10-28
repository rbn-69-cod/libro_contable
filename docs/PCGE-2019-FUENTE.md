# Catálogo PCGE Modificado 2019

El archivo [`src/data/pcge-2019.json`](../src/data/pcge-2019.json) fue generado a partir del catálogo de cuentas del **Plan Contable General Empresarial Modificado 2019**, aprobado por la Resolución CNC N.° 002-2019-EF/30.

Fuente oficial: [Ministerio de Economía y Finanzas — PCGE](https://www.mef.gob.pe/es/contabilidad-publica-sp-6700/388-documentacion/6127-plan-contable-general-empresarial) y [PDF oficial](https://cdn.www.gob.pe/uploads/document/file/315820/PCGE_2019.pdf?v=1558717214).

El dataset contiene los códigos y denominaciones del catálogo, sus niveles, relaciones padre-hijo, tipo contable y si son hojas habilitadas para movimientos. Los elementos 9 y 0 se incluyen como encabezados estructurales porque el PCGE no prescribe un catálogo cerrado de cuentas para contabilidad analítica ni cuentas de orden.

La fuente presenta el código `6882` con dos denominaciones en el texto extraído. El dataset conserva la primera denominación como código único y registra la discrepancia en `duplicados_fuente`; no se inventó un código alternativo. La importación impide duplicados y no modifica cuentas existentes con movimientos.

Validación reproducible:

```bash
npm run validate:pcge
```
