# Bernardo Café — Tienda Online

Sitio web de venta directa para **Bernardo Café**, café de especialidad desde Ituango, Antioquia.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Deploy**: Vercel
- **Pagos**: Manual (Bancolombia / Nequi)

---

## 🚀 Deploy en Vercel (paso a paso)

### 1. Sube el código a GitHub

```bash
# En la carpeta del proyecto:
git init
git add .
git commit -m "Bernardo Café - primera versión"

# Crea un repositorio en github.com (ej: bernardo-cafe)
# Luego:
git remote add origin https://github.com/TU_USUARIO/bernardo-cafe.git
git branch -M main
git push -u origin main
```

### 2. Conecta con Vercel

1. Ve a [vercel.com](https://vercel.com) → **New Project**
2. Importa el repositorio `bernardo-cafe`
3. Deja todas las opciones por defecto
4. Haz clic en **Deploy**

¡Listo! Tu tienda estará en vivo en `https://bernardo-cafe.vercel.app` (o el dominio que elijas).

---

## 📦 Probar localmente

```bash
npm install
npm run dev
# Abre http://localhost:3000
```

---

## 🔧 Configuración pendiente

### Agregar tu número de pago
En `components/Cart.tsx`, busca esta línea y reemplaza:
```
🔒 Pendiente de configurar
```
Por tu número de Bancolombia o Nequi.

### Conectar Google Sheets (opcional)
En `app/api/pedido/route.ts` hay instrucciones comentadas para conectar un Google Sheets webhook via Apps Script.

---

## 📁 Estructura

```
bernardo-cafe/
├── app/
│   ├── page.tsx          # Página principal
│   ├── page.module.css   # Estilos de la página
│   ├── layout.tsx        # Layout raíz
│   ├── globals.css       # Variables CSS globales
│   └── api/pedido/       # Endpoint de pedidos
├── components/
│   ├── Cart.tsx          # Carrito + formulario
│   └── Cart.module.css   # Estilos del carrito
└── public/images/        # Imágenes de la marca
```
