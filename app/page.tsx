'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Cart from '@/components/Cart'
import type { CartItem } from '@/components/Cart'
import styles from './page.module.css'

const PRODUCTOS = [
  {
    id: 'bernardo-molido-340g',
    nombre: 'Bernardo Antonio',
    subtitulo: 'Café Molido',
    gramaje: '340g',
    precio: 35000,
    origen: 'Ituango, Antioquia',
    altura: '1.520 m.s.n.m.',
    proceso: 'Suave lavado',
    notas: 'Caramelo y Chocolate',
    variedad: 'Castillo',
    desde: 'desde 1970',
    imagen: '/images/producto-molido.png',
  },
  {
    id: 'bernardo-grano-340g',
    nombre: 'Bernardo Antonio',
    subtitulo: 'Café en Grano',
    gramaje: '340g',
    precio: 35000,
    origen: 'Ituango, Antioquia',
    altura: '1.520 m.s.n.m.',
    proceso: 'Suave lavado',
    notas: 'Caramelo y Chocolate',
    variedad: 'Castillo',
    desde: 'desde 1970',
    imagen: '/images/producto.jpeg',
  },
]

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (producto: typeof PRODUCTOS[0]) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.producto.id === producto.id)
      if (exists) return prev.map(i => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { producto, cantidad: 1 }]
    })
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', { value: producto.precio, currency: 'COP' })
    }
    setCartOpen(true)
  }

  const totalItems = cartItems.reduce((a, i) => a + i.cantidad, 0)

  useEffect(() => {
    const handleScroll = () => {
      const bg = document.getElementById('heroBg')
      if (bg) bg.style.transform = `translateY(${window.scrollY * 0.4}px)`
      const abuelo = document.getElementById('abueloParallax')
      if (abuelo) abuelo.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className={styles.main}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <Image
            src="/images/abuelo.png"
            alt="Don Bernardo"
            width={38}
            height={38}
            className={styles.navAbuelo}
          />
          <span className={styles.navBrand}>Bernardo Café</span>
        </div>
        <div className={styles.navCenter}>
          <span className={styles.navTagline}>Café de Especialidad · Ituango, Antioquia</span>
        </div>
        <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} id="heroBg" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>República de Colombia · Desde 1970</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleBernardo}>Bernardo</span>
            <span className={styles.heroTitleCafe}>Café</span>
          </h1>
          <div className={styles.abueloWrap} id="abueloParallax">
            <Image
              src="/images/abuelo.png"
              alt="Don Bernardo"
              width={160}
              height={160}
              className={styles.abueloHero}
            />
          </div>
          <p className={styles.heroSub}>El sabor de Ituango en cada taza</p>
        </div>
        <div className={styles.heroScroll}>
          <span>Conoce el café</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* CEDULA */}
      <section className={styles.cedula}>
        <div className={styles.cedulaInner}>
          <div className={styles.cedulaCard}>
            <div className={styles.cedulaHeader}>
              <span className={styles.cedulaHeaderText}>CÉDULA DE CAFETEROS</span>
            </div>
            <div className={styles.cedulaGrid}>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Fecha de nacimiento</span>
                <span className={styles.cedulaValue}>desde 1970</span>
              </div>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Lugar</span>
                <span className={styles.cedulaValue}>Ituango, Antioquia</span>
              </div>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Altitud</span>
                <span className={styles.cedulaValue}>1.520 m.s.n.m.</span>
              </div>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Proceso</span>
                <span className={styles.cedulaValue}>Suave lavado</span>
              </div>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Notas</span>
                <span className={styles.cedulaValue}>Caramelo y Chocolate</span>
              </div>
              <div className={styles.cedulaField}>
                <span className={styles.cedulaLabel}>Variedad</span>
                <span className={styles.cedulaValue}>Castillo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className={styles.product} id="producto">
        <div className={styles.productsGrid}>
          {PRODUCTOS.map((prod) => (
            <div key={prod.id} className={styles.productInner}>
              <div className={styles.productImageCol}>
                <div className={styles.productImageWrap}>
                  <Image
                    src={prod.imagen}
                    alt={prod.subtitulo}
                    width={420}
                    height={480}
                    className={styles.productImage}
                  />
                  <div className={styles.productBadge}>{prod.gramaje}</div>
                </div>
              </div>
              <div className={styles.productInfo}>
                
                <h1 className={styles.productName}>{prod.subtitulo}</h1>
                <p className={styles.productVariety}>Variedad Castillo · Ituango, Antioquia</p>
                <div className={styles.productNotes}>
                  <div className={styles.noteTag}>☕ Caramelo</div>
                  <div className={styles.noteTag}>🍫 Chocolate</div>
                  <div className={styles.noteTag}>🌿 Suave lavado</div>
                </div>
                <div className={styles.productPricing}>
                  <div className={styles.productPrice}>
                    <span className={styles.priceCurrency}>$</span>
                    <span className={styles.priceAmount}>35.000</span>
                    <span className={styles.priceUnit}>COP / 340g</span>
                  </div>
                  <button className={styles.addToCartBtn} onClick={() => addToCart(prod)}>
                    Agregar al carrito
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <p className={styles.shippingNote}>
                  📦 Envío a todo Colombia · Pago por Bancolombia o Nequi
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerBrand}>Bernardo Café</p>
          <p className={styles.footerText}>Café de Especialidad · Ituango, Antioquia, Colombia</p>
          <a
            href="https://www.instagram.com/don_bernardo_cafe/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerInstagram}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @don_bernardo_cafe
          </a>
          <p className={styles.footerSub}>Hecho con amor desde 1970</p>
        </div>
      </footer>

      {/* CART DRAWER */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        setItems={setCartItems}
      />
    </main>
  )
}
