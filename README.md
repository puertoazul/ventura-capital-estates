# VENTURA CAPITAL & ESTATES

Sitio inmobiliario estático para apartamentos en venta y alquiler en Bogotá. Diseñado para GitHub Pages; no requiere servidor ni base de datos.

## Archivos

- `index.html`: estructura de la web.
- `styles.css`: identidad visual y diseño adaptable.
- `script.js`: carga del catálogo, filtros, fichas y enlaces de contacto.
- `data/configuracion.json`: datos comerciales y colores de marca.
- `data/propiedades.json`: catálogo editable de apartamentos.
- `assets/logo/ventura-logo.png`: logotipo extraído del documento original suministrado.

## Añadir una propiedad

Edita `data/propiedades.json` y agrega objetos con esta estructura. Usa imágenes dentro de `assets/img/` y rutas relativas:

```json
[
  {
    "id": "apt-001",
    "titulo": "Apartamento en [zona]",
    "operacion": "venta",
    "zona": "Chapinero",
    "precio": 450000000,
    "habitaciones": 3,
    "banos": 2,
    "area_m2": 78,
    "descripcion": "Descripción real del inmueble.",
    "imagenes": ["assets/img/apt-001-1.jpg", "assets/img/apt-001-2.jpg"]
  }
]
```

`operacion` debe ser `venta` o `alquiler`. Para alquiler, `precio` es el canon mensual en COP. No se incluyeron inmuebles ficticios: el catálogo inicia vacío hasta que se carguen propiedades reales.

## Cambiar los datos de contacto

Edita `data/configuracion.json`. El número de WhatsApp debe incluir indicativo de país, solo dígitos. Instagram puede añadirse en el campo `instagram` cuando esté definido.

## Probar localmente

Como el navegador bloquea `fetch()` desde `file://`, inicia un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`.

## Publicar gratis en GitHub Pages

1. Crea un repositorio público en GitHub, por ejemplo `ventura-capital-estates`.
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda y espera a que GitHub Pages publique la dirección del sitio.

## Antes de publicar

- Cargar de 5 a 10 propiedades reales, con precios y características verificadas.
- Añadir fotografías autorizadas y optimizadas a `assets/img/`.
- Probar filtros, fichas, WhatsApp y correo desde un servidor local.
- Confirmar que el número y correo comerciales siguen vigentes.
