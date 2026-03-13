import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bernardo Café — Café de Especialidad',
  description: 'Café de especialidad desde Ituango, Antioquia. Variedad Castillo, proceso suave lavado, notas a caramelo y chocolate.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Bernardo Café',
    description: 'Café de especialidad colombiano desde 1970',
    images: ['/images/etiqueta.png'],
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
