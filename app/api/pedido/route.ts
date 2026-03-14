import { NextRequest, NextResponse } from 'next/server'

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxbOPEVR19nkTqlrxgI2e6LHRHHG-3_dwTiaAHqlTrj_afl_RXNELnHL_JPu5J2qc3Z/exec'

function generarId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BCA-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const { form, items, total } = await req.json()

    const pedidoId = generarId()
    const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })

    console.log('=== NUEVO PEDIDO ===', pedidoId)

    for (const item of items) {
      const subtotal = item.producto.precio * item.cantidad

      const params = new URLSearchParams({
        idVenta:        pedidoId,
        fecha:          fecha,
        estado:         'Pendiente',
        idProducto:     item.producto.id,
        metodoPago:     form.metodoPago === 'bancolombia' ? 'Bancolombia' : 'Nequi',
        cantidad:       String(item.cantidad),
        precioUnitario: String(item.producto.precio),
        subtotal:       String(subtotal),
        cliente:        form.nombre,
        telefono:       form.telefono,
        correo:         form.email,
        direccion:      `${form.ciudad} - ${form.direccion}`,
        canalVenta:     'Web',
        descuento:      '0',
        costoEnvio:     '0',
        total:          String(total),
      })

      const url = `${SHEET_URL}?${params.toString()}`
      console.log('📤 GET a Sheets...')

      const sheetRes = await fetch(url, { redirect: 'follow' })
      const sheetText = await sheetRes.text()
      console.log('📊 Sheets:', sheetRes.status, sheetText)
    }

    return NextResponse.json({ ok: true, pedidoId })
  } catch (err) {
    console.error('❌ Error:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
