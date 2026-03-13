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

    console.log('=== NUEVO PEDIDO ===')
    console.log('ID:', pedidoId)
    console.log('Cliente:', form.nombre)
    console.log('Envío:', `${form.ciudad} - ${form.direccion}`)

    for (const item of items) {
      const subtotal = item.producto.precio * item.cantidad

      const payload = {
        idVenta:        pedidoId,
        fecha:          fecha,
        estado:         'Pendiente',
        idProducto:     item.producto.id,
        metodoPago:     form.metodoPago === 'bancolombia' ? 'Bancolombia' : 'Nequi',
        cantidad:       item.cantidad,
        precioUnitario: item.producto.precio,
        subtotal:       subtotal,
        cliente:        form.nombre,
        telefono:       form.telefono,
        correo:         form.email,
        direccion:      `${form.ciudad} - ${form.direccion}`,
        canalVenta:     'Web',
        descuento:      0,
        costoEnvio:     0,
        total:          total,
      }

      console.log('📤 Enviando a Sheets:', JSON.stringify(payload))

      const sheetRes = await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      })

      const sheetText = await sheetRes.text()
      console.log('📊 Sheets status:', sheetRes.status)
      console.log('📊 Sheets body:', sheetText)
    }

    console.log(`✅ Pedido ${pedidoId} procesado`)

    return NextResponse.json({ ok: true, pedidoId })
  } catch (err) {
    console.error('❌ Error procesando pedido:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
