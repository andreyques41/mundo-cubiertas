import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CATEGORIAS = ['Cubiertas metálicas', 'Canaletas', 'Portones', 'Láminas', 'Perfiles metálicos', 'Accesorios', 'Otros'];
const UNIDADES   = ['m2', 'ml', 'unidad', 'kg', 'rollo', 'caja'];

const HEADER_COLOR  = 'FF1E293B';
const HEADER_TEXT   = 'FFFFFFFF';
const ALT_ROW_COLOR = 'FFF8FAFC';

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Mundo Cubiertas';

  // ── Hoja 1: Productos ─────────────────────────────────────────────
  const ws = wb.addWorksheet('Productos', { views: [{ state: 'frozen', ySplit: 2 }] });

  const COLS = [
    { header: 'Nombre *',              key: 'nombre',      width: 40 },
    { header: 'Categoría *',           key: 'categoria',   width: 22 },
    { header: 'Descripción',           key: 'descripcion', width: 45 },
    { header: 'Precio (₡) *',          key: 'precio',      width: 18 },
    { header: 'Unidad *',              key: 'unidad',      width: 12 },
    { header: 'Foto (archivo o link)', key: 'foto',        width: 36 },
    { header: 'Ficha técnica (PDF o link)', key: 'ficha',  width: 36 },
    { header: 'Video (link)',          key: 'video',       width: 36 },
    { header: '¿Destacado?',           key: 'destacado',   width: 14 },
  ];

  COLS.forEach((c, i) => { ws.getColumn(i + 1).width = c.width; });

  // Fila de encabezados
  const headerRow = ws.addRow(COLS.map(c => c.header));
  headerRow.height = 26;
  headerRow.eachCell(cell => {
    cell.font      = { bold: true, color: { argb: HEADER_TEXT }, size: 11 };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Fila de ejemplo
  const ejemploRow = ws.addRow([
    'Lámina Zinc Galvanizada Cal 26',
    'Cubiertas metálicas',
    'Lámina galvanizada calibre 26 para techos residenciales',
    15000,
    'm2',
    'lamina_zinc_cal26.jpg  ó  https://drive.google.com/...',
    'ficha_zinc_cal26.pdf  ó  https://drive.google.com/...',
    'https://youtube.com/...',
    'Sí',
  ]);
  ejemploRow.height = 18;
  ejemploRow.eachCell(cell => {
    cell.font = { italic: true, color: { argb: 'FF2563EB' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
    cell.alignment = { vertical: 'middle' };
  });
  ejemploRow.getCell(4).numFmt = '#,##0.00';

  // Filas en blanco (100 filas)
  for (let r = 3; r <= 102; r++) {
    const row  = ws.addRow([]);
    const isAlt = r % 2 === 0;
    row.height = 18;

    for (let c = 1; c <= COLS.length; c++) {
      const cell = row.getCell(c);
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: isAlt ? ALT_ROW_COLOR : 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle' };
      cell.border    = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
    }

    // Dropdown Categoría
    row.getCell(2).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: [`"${CATEGORIAS.join(',')}"`],
      showErrorMessage: true, errorTitle: 'Categoría inválida',
      error: 'Elegí una opción de la lista.',
    };

    // Dropdown Unidad
    row.getCell(5).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: [`"${UNIDADES.join(',')}"`],
      showErrorMessage: true, errorTitle: 'Unidad inválida',
      error: 'Elegí una opción de la lista.',
    };

    // Dropdown Destacado
    row.getCell(9).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: ['"Sí,No"'],
    };

    row.getCell(4).numFmt = '#,##0.00';
  }

  // ── Hoja 2: Info del Negocio ──────────────────────────────────────
  const wsInfo = wb.addWorksheet('Info del Negocio');
  wsInfo.getColumn(1).width = 30;
  wsInfo.getColumn(2).width = 55;

  const addTitle = (text) => {
    const row = wsInfo.addRow([text]);
    wsInfo.mergeCells(`A${row.number}:B${row.number}`);
    row.getCell(1).font = { bold: true, color: { argb: HEADER_TEXT }, size: 11 };
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.height = 24;
  };

  const addField = (label, placeholder = '') => {
    const row = wsInfo.addRow([label, placeholder]);
    row.getCell(1).font      = { bold: true };
    row.getCell(2).font      = { color: { argb: 'FF94A3B8' }, italic: !!placeholder };
    row.getCell(2).alignment = { vertical: 'middle', wrapText: true };
    row.getCell(1).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    row.height = 20;
  };

  const addBlank = () => wsInfo.addRow([]);

  addTitle('INFORMACIÓN GENERAL');
  addField('Nombre comercial',          'Ej: Mundo Cubiertas');
  addField('Logo',                      'Nombre del archivo o link de Google Drive');
  addField('Descripción de la empresa', 'Máximo 3 líneas: qué hacen, dónde están, qué los diferencia');
  addBlank();

  addTitle('CONTACTO Y UBICACIÓN');
  addField('Dirección exacta',          'Ej: 200m norte del cruce de Hatillo, San José');
  addField('Teléfono principal',        'Ej: +506 8578-7337');
  addField('WhatsApp (si es diferente)','Ej: +506 8578-7337');
  addField('Correo de contacto',        'Ej: ventas@mundocubiertas.com (si ya tienen)');
  addField('Horario de atención',       'Ej: Lunes a viernes 7am–5pm, Sábados 7am–12pm');
  addBlank();

  addTitle('REDES SOCIALES');
  addField('Instagram',  'Link completo o @usuario');
  addField('Facebook',   'Link completo o nombre de página');
  addField('TikTok',     'Link completo o @usuario (si tienen)');
  addField('YouTube',    'Link del canal (si tienen)');

  // Guardar
  const outputPath = join(__dirname, 'plantilla-productos-mundo-cubiertas.xlsx');
  await wb.xlsx.writeFile(outputPath);
  console.log(`✓ Plantilla generada: ${outputPath}`);
}

main().catch(console.error);
