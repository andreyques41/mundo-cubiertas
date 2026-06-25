import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const s = StyleSheet.create({
  page:       { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  header:     { marginBottom: 24 },
  title:      { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#166534' },
  subtitle:   { fontSize: 10, color: '#6b7280', marginTop: 2 },
  divider:    { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginVertical: 16 },
  row:        { flexDirection: 'row', marginBottom: 4 },
  label:      { width: 120, color: '#6b7280' },
  value:      { flex: 1 },
  badge:      { backgroundColor: '#dcfce7', color: '#166534', padding: '3 8', borderRadius: 4, fontSize: 9 },
  tableHead:  { flexDirection: 'row', backgroundColor: '#f9fafb', padding: '8 6', marginBottom: 2 },
  tableRow:   { flexDirection: 'row', padding: '6 6', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  colNombre:  { flex: 3 },
  colCant:    { flex: 1, textAlign: 'right' },
  colPrecio:  { flex: 1.5, textAlign: 'right' },
  colTotal:   { flex: 1.5, textAlign: 'right' },
  bold:       { fontFamily: 'Helvetica-Bold' },
  totalRow:   { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  totalBox:   { backgroundColor: '#f0fdf4', padding: '8 12', borderRadius: 4 },
  footer:     { position: 'absolute', bottom: 30, left: 40, right: 40, color: '#9ca3af', fontSize: 8, textAlign: 'center' },
});

const fmt = (n: number | string) =>
  `₡${Number(n).toLocaleString('es-CR', { minimumFractionDigits: 0 })}`;

export function CotizacionPDF({ cotizacion }: { cotizacion: any }) {
  const { id, cliente, items, total, notas, url_planos, tiene_planos, estado, created_at } = cotizacion;
  const fecha = new Date(created_at).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Encabezado */}
        <View style={s.header}>
          <Text style={s.title}>Mundo Cubiertas</Text>
          <Text style={s.subtitle}>Cubiertas metálicas · Techos · Fachadas · Láminas · Paneles</Text>
        </View>

        <View style={[s.row, { justifyContent: 'space-between', marginBottom: 16 }]}>
          <View>
            <Text style={[s.bold, { fontSize: 14 }]}>Cotización #{id}</Text>
            <Text style={{ color: '#6b7280', marginTop: 2 }}>{fecha}</Text>
          </View>
          <Text style={s.badge}>{estado.toUpperCase()}</Text>
        </View>

        <View style={s.divider} />

        {/* Datos del cliente */}
        <Text style={[s.bold, { marginBottom: 8 }]}>Datos del cliente</Text>
        <View style={s.row}><Text style={s.label}>Nombre</Text><Text style={s.value}>{cliente?.nombre}</Text></View>
        {cliente?.empresa && <View style={s.row}><Text style={s.label}>Empresa</Text><Text style={s.value}>{cliente.empresa}</Text></View>}
        <View style={s.row}><Text style={s.label}>Teléfono</Text><Text style={s.value}>{cliente?.telefono}</Text></View>
        {cliente?.email && <View style={s.row}><Text style={s.label}>Email</Text><Text style={s.value}>{cliente.email}</Text></View>}
        <View style={s.row}>
          <Text style={s.label}>Planos</Text>
          <Text style={s.value}>{tiene_planos ? 'Sí cuenta con planos' : 'Sin planos — precio referencial'}</Text>
        </View>
        {url_planos && <View style={s.row}><Text style={s.label}>Descripción</Text><Text style={s.value}>{url_planos}</Text></View>}

        <View style={s.divider} />

        {/* Tabla de productos */}
        {items?.length > 0 && (
          <View>
            <Text style={[s.bold, { marginBottom: 8 }]}>Productos cotizados</Text>
            <View style={s.tableHead}>
              <Text style={[s.colNombre, s.bold]}>Producto</Text>
              <Text style={[s.colCant, s.bold]}>Cant.</Text>
              <Text style={[s.colPrecio, s.bold]}>Precio unit.</Text>
              <Text style={[s.colTotal, s.bold]}>Subtotal</Text>
            </View>
            {items.map((item: any) => (
              <View style={s.tableRow} key={item.id}>
                <Text style={s.colNombre}>{item.producto?.nombre}</Text>
                <Text style={s.colCant}>{Number(item.cantidad)} {item.unidad}</Text>
                <Text style={s.colPrecio}>{fmt(item.precio_unitario)}</Text>
                <Text style={s.colTotal}>{fmt(item.subtotal)}</Text>
              </View>
            ))}
            {total && (
              <View style={s.totalRow}>
                <View style={s.totalBox}>
                  <Text style={s.bold}>Total estimado: {fmt(total)}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {!tiene_planos && (
          <Text style={{ color: '#92400e', backgroundColor: '#fffbeb', padding: '6 10', borderRadius: 4, marginTop: 12, fontSize: 9 }}>
            * Los precios son referenciales y pueden variar según la medición técnica final del proyecto.
          </Text>
        )}

        {/* Notas */}
        {notas && (
          <View style={{ marginTop: 16 }}>
            <Text style={[s.bold, { marginBottom: 4 }]}>Notas</Text>
            <Text style={{ color: '#4b5563' }}>{notas}</Text>
          </View>
        )}

        {/* Pie de página */}
        <Text style={s.footer}>
          Mundo Cubiertas — Este documento es una cotización de referencia y no constituye una factura.
        </Text>
      </Page>
    </Document>
  );
}
