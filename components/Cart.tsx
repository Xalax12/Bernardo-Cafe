'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './Cart.module.css'

export interface Producto {
  id: string
  nombre: string
  subtitulo: string
  gramaje: string
  precio: number
  origen: string
  altura: string
  proceso: string
  notas: string
  variedad: string
  desde: string
}

export interface CartItem {
  producto: Producto
  cantidad: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
}

type Step = 'carrito' | 'datos' | 'pago' | 'confirmado'

export default function Cart({ isOpen, onClose, items, setItems }: CartProps) {
  const [step, setStep] = useState<Step>('carrito')
  const [loading, setLoading] = useState(false)
  const [pedidoId, setPedidoId] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ciudad: '',
    direccion: '',
    metodoPago: 'bancolombia' as 'bancolombia' | 'nequi',
  })

  const total = items.reduce((a, i) => a + i.producto.precio * i.cantidad, 0)
  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO').format(n)

  const updateCantidad = (id: string, delta: number) => {
    setItems(prev => prev
      .map(i => i.producto.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
      .filter(i => i.cantidad > 0)
    )
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.email || !form.ciudad || !form.direccion) {
      alert('Por favor completa todos los campos')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, total }),
      })
      const data = await res.json()
      if (data.ok) {
        setPedidoId(data.pedidoId)
        setStep('pago')
      } else {
        alert('Hubo un error. Intenta de nuevo.')
      }
    } catch {
      alert('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const confirmarPago = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value: total, currency: 'COP' })
    }
    setStep('confirmado')
    setItems([])
  }

  const handleClose = () => {
    onClose()
    if (step === 'confirmado') {
      setTimeout(() => setStep('carrito'), 400)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          {step !== 'carrito' && step !== 'confirmado' && (
            <button className={styles.backBtn} onClick={() => setStep(step === 'pago' ? 'datos' : 'carrito')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
          )}
          <h2 className={styles.title}>
            {step === 'carrito' && 'Tu pedido'}
            {step === 'datos' && 'Datos de envío'}
            {step === 'pago' && 'Realizar pago'}
            {step === 'confirmado' && '¡Pedido recibido!'}
          </h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'confirmado' && (
          <div className={styles.steps}>
            {(['carrito', 'datos', 'pago'] as Step[]).map((s, i) => (
              <div key={s} className={`${styles.step} ${step === s ? styles.stepActive : ''} ${(['carrito', 'datos', 'pago'].indexOf(step) > i) ? styles.stepDone : ''}`}>
                <div className={styles.stepDot}>{i + 1}</div>
                <span>{s === 'carrito' ? 'Carrito' : s === 'datos' ? 'Datos' : 'Pago'}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.body}>
          {/* STEP: CARRITO */}
          {step === 'carrito' && (
            <div className={styles.cartStep}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <p>Tu carrito está vacío</p>
                  <button className={styles.emptyBtn} onClick={handleClose}>Ver productos</button>
                </div>
              ) : (
                <>
                  {items.map(item => (
                    <div key={item.producto.id} className={styles.cartItem}>
                      <Image src="/images/producto1.jpeg" alt={item.producto.nombre} width={72} height={72} className={styles.itemImg} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.producto.nombre}</p>
                        <p className={styles.itemGramaje}>{item.producto.gramaje}</p>
                        <p className={styles.itemPrice}>${formatCOP(item.producto.precio)} COP</p>
                      </div>
                      <div className={styles.itemQty}>
                        <button onClick={() => updateCantidad(item.producto.id, -1)}>−</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => updateCantidad(item.producto.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className={styles.totalAmount}>${formatCOP(total)} COP</span>
                  </div>
                  <button className={styles.primaryBtn} onClick={() => setStep('datos')}>
                    Continuar con el pedido →
                  </button>
                </>
              )}
            </div>
          )}

          {/* STEP: DATOS */}
          {step === 'datos' && (
            <div className={styles.formStep}>
              <div className={styles.field}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={form.telefono}
                    onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Ciudad</label>
                <input
                  type="text"
                  placeholder="Ciudad de envío"
                  value={form.ciudad}
                  onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Dirección completa</label>
                <input
                  type="text"
                  placeholder="Dirección, barrio, apartamento..."
                  value={form.direccion}
                  onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Método de pago</label>
                <div className={styles.payMethods}>
                  <button
                    className={`${styles.payMethod} ${form.metodoPago === 'bancolombia' ? styles.payMethodActive : ''}`}
                    onClick={() => setForm(f => ({ ...f, metodoPago: 'bancolombia' }))}
                  >
                    🏦 Bancolombia
                  </button>
                  <button
                    className={`${styles.payMethod} ${form.metodoPago === 'nequi' ? styles.payMethodActive : ''}`}
                    onClick={() => setForm(f => ({ ...f, metodoPago: 'nequi' }))}
                  >
                    📱 Nequi
                  </button>
                </div>
              </div>
              <div className={styles.orderSummary}>
                <span>Total a pagar</span>
                <span className={styles.totalAmount}>${formatCOP(total)} COP</span>
              </div>
              <button className={styles.primaryBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pedido →'}
              </button>
            </div>
          )}

          {/* STEP: PAGO */}
          {step === 'pago' && (
            <div className={styles.pagoStep}>
              <div className={styles.pagoBox}>
                <div className={styles.pagoIcon}>
                  {form.metodoPago === 'bancolombia' ? '🏦' : '📱'}
                </div>
                <h3>{form.metodoPago === 'bancolombia' ? 'Bancolombia' : 'Nequi'}</h3>
                <p className={styles.pagoInstrucciones}>
                  Realiza la transferencia por el valor exacto de:
                </p>
                <div className={styles.pagoMonto}>${formatCOP(total)} COP</div>
                <div className={styles.pagoDatos}>
                  <div className={styles.pagoDato}>
                    <span>Número de cuenta / celular</span>
                    <strong>37700027962</strong>
                  </div>
                  <div className={styles.pagoDato}>
                    <span>Titular</span>
                    <strong>Bernardo Café</strong>
                  </div>
                  <div className={styles.pagoDato}>
                    <span>Referencia de pago</span>
                    <strong className={styles.pedidoId}>{pedidoId}</strong>
                  </div>
                </div>
                <p className={styles.pagoNota}>
                  ⚡ Una vez realizado el pago, haz clic en "Ya pagué" y te contactaremos por WhatsApp para confirmar tu pedido.
                </p>
              </div>
              <button className={styles.primaryBtn} onClick={confirmarPago}>
                ✅ Ya pagué
              </button>
            </div>
          )}

          {/* STEP: CONFIRMADO */}
          {step === 'confirmado' && (
            <div className={styles.confirmadoStep}>
              <div className={styles.confIcon}>☕</div>
              <h3>¡Gracias por tu pedido!</h3>
              <p>Hemos recibido tu orden. Nos contactaremos contigo pronto para confirmar el envío.</p>
              <div className={styles.confPedidoId}>
                <span>ID de pedido</span>
                <strong>{pedidoId}</strong>
              </div>
              <p className={styles.confNota}>Guarda este número como referencia.</p>
              <button className={styles.primaryBtn} onClick={handleClose}>
                Volver a la tienda
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
