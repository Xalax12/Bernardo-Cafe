import { NextRequest, NextResponse } from 'next/server'

function generarId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BCA-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const { form, items, total } = await req.json()

    const pedidoId = generarId()
    const timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })

    // Log del pedido (en Vercel aparece en los logs)
    console.log('=== NUEVO PEDIDO ===')
    console.log('ID:', pedidoId)
    console.log('Fecha:', timestamp)
    console.log('Cliente:', form.nombre, '|', form.telefono, '|', form.email)
    console.log('Envío:', form.ciudad, '-', form.direccion)
    console.log('Pago:', form.metodoPago)
    console.log('Items:', JSON.stringify(items))
    console.log('Total: $', total)
    console.log('===================')

    // Aquí puedes conectar Google Sheets más adelante:
    // const SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL
    // if (SHEET_URL) { await fetch(SHEET_URL, { method: 'POST', ... }) }

    return NextResponse.json({ ok: true, pedidoId })
  } catch (err) {
    console.error('Error procesando pedido:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
