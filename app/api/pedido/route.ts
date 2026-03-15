import { NextRequest, NextResponse } from 'next/server'

const MAKE_URL = 'https://hook.us2.make.com/5cy4775ny3kmjw5q9dgq9uv3qk3w1frb'

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

      const res = await fetch(MAKE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('📊 Make status:', res.status)
    }

    console.log(`✅ Pedido ${pedidoId} procesado`)
    return NextResponse.json({ ok: true, pedidoId })

  } catch (err) {
    console.error('❌ Error:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
