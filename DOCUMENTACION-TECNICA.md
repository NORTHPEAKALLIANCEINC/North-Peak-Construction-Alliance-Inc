# North Peak Construction Alliance Inc. — Documentación técnica

Bitácora del sitio `https://northalliancegroup.ca`.
Este archivo no lo carga ninguna página: es documentación del repositorio.

Última actualización: 13 de julio de 2026

---

## 1. Infraestructura

| Elemento | Estado |
|---|---|
| Alojamiento | GitHub Pages, repo `North-Peak-Construction-Alliance-Inc` |
| Dominio | `northalliancegroup.ca` — SIN `www` (el `www` no resuelve) |
| DNS | Hostinger. Nameservers de Hostinger. NO TOCAR |
| HTTPS | Activo, con "Enforce HTTPS" marcado |
| Formularios | Web3Forms. Plan gratuito: 250 envíos/mes |
| Correo de recepción | `admin@northalliancegroup.ca` |

### Registros DNS
Los 4 registros A de GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

**Aviso histórico:** existía un registro A intruso `@ → 2.57.91.91` (aparcamiento de Hostinger) que competía con los de GitHub. El DNS repartía las visitas al azar entre GitHub y una página de Hostinger. Ya eliminado. Si el sitio vuelve a "funcionar a veces sí y a veces no", no es caché: es que hay dos destinos activos a la vez. Revisar los registros A.

---

## 2. Estructura

URLs limpias, sin `.html`. Cada página es `carpeta/index.html`:

```
/                                index.html
/about/index.html
/services/index.html
/indigenous-procurement/index.html
/projects/index.html
/careers/index.html
/contact/index.html

css/    tokens.css  style.css  layout.css  header.css  components.css
js/     main.js
images/
CNAME   favicon.svg   robots.txt   sitemap.xml   og-image.jpg
```

Los archivos sueltos en la raíz con nombres en español (`nosotros.html`, `servicios.html`…) son redirecciones de las URLs antiguas. No son páginas.

**Regla crítica:** todas las rutas de recursos son absolutas desde la raíz (`/css/`, `/js/`, `/images/`). Dentro de una subcarpeta, las rutas relativas fallan.

**Caché:** al modificar un CSS o el JS hay que subir el número de versión en las 7 páginas (`?v=N`). Estado actual: CSS `?v=62`, `main.js?v=22`.

---

## 3. Sistema de diseño

Paleta Navy and Gold. Azul marino para la estructura, dorado para el acento.

- La variable de acento se llama `--cyan` por compatibilidad histórica, **pero su valor es dorado**. No renombrar.
- Dos temas: claro (por defecto) y oscuro. Un tercer tema fue descartado.
- Contraste WCAG verificado: texto AAA, acentos AA.

Lenguaje visual: cristal translúcido con filamento de luz dorada en el borde superior y resplandor. Aplicado a botones, tarjetas de servicio, paneles de formulario, bandas CTA, campos de texto y al interruptor de tema. El dorado va en el texto y en la luz, nunca como relleno macizo.

Movimiento: `--ease-out: cubic-bezier(0.22,1,0.36,1)`. Duraciones: 140 ms (rápido), 260 ms (base), 700 ms (revelado).

---

## 4. SEO — trabajo realizado

Todo esto está en el código y viaja con el sitio. No depende de ninguna cuenta personal.

### Metadatos
- Título y descripción únicos en cada una de las 7 páginas.
- `canonical` en todas, con `https` y sin `www`.
- Open Graph y Twitter Card completos, con imagen social real (`/images/og-image.jpg`, 1200x630).
- `robots`: `index, follow, max-image-preview:large, max-snippet:-1`.
- `theme-color` por esquema claro y oscuro.
- Un solo `h1` por página.

### Datos estructurados (Schema.org, JSON-LD)
Presentes en las 7 páginas:

- `GeneralContractor` (subtipo de empresa local): nombre legal, teléfono, correo, dirección postal completa, número de corporación 1521162-0, zona de servicio (Ontario y Canadá), los dos directores y las áreas de servicio.
- `WebSite` y `WebPage` / `AboutPage` / `ContactPage` / `CollectionPage` según la página.
- `BreadcrumbList` en las 6 páginas interiores.
- `OfferCatalog` en Services, con los 10 servicios como `Service`, cada uno con proveedor y área servida.

Validado con la Prueba de Resultados Enriquecidos de Google: "Empresas locales" y "Organización", 1 elemento válido cada uno, sin errores críticos.

**Campos opcionales que faltan a propósito** (pendientes del cliente, ver punto 7): `openingHours`, `priceRange`, `sameAs` (redes sociales), reseñas. No se inventan: datos falsos en el schema son motivo de penalización.

### Rendimiento
- `fetchpriority="high"` en las imágenes del hero (mejora el LCP).
- `loading="lazy"` y `decoding="async"` en las imágenes fuera de pantalla.
- Sin librerías de terceros. Sin frameworks. CSS y JS propios.

### Indexación
- `sitemap.xml` con las 7 URLs, enviado y aceptado en Google Search Console.
- `robots.txt` apuntando al sitemap.
- Home indexada y confirmada por Google. Rastreo prioritario solicitado.

---

## 5. Google Search Console

Propiedad de tipo **dominio**, verificada por registro TXT en el DNS de Hostinger.

- La etiqueta `google-site-verification` está también como meta en las 7 páginas.
- Al enviar el sitemap en una propiedad de dominio hay que escribir la URL completa: `https://northalliancegroup.ca/sitemap.xml`. La ruta corta da error.

### Traspaso al cliente
1. Search Console → Configuración → Usuarios y permisos → Añadir usuario → correo del cliente → permiso de **Propietario**.
2. El cliente acepta desde su correo y verifica con su propio método (TXT propio o etiqueta HTML).
3. Solo entonces, retirar al desarrollador de la lista.

**Aviso:** la verificación actual depende del registro TXT en Hostinger. Si se borra ese TXT, la propiedad se cae.

---

## 6. Errores ya cometidos — no repetir

1. **Rutas en CSS:** al vivir el CSS en `css/`, `url('img.webp')` busca en `css/img.webp`. Debe ser `url('../img.webp')`.
2. **`z-index: -1`** en un pseudo-elemento: se esconde detrás del fondo de la página. Usar z-index positivos.
3. **`translateY` en transiciones de página o revelados de primera pantalla:** produce un brinco. Fundido puro.
4. **`min-width: auto` en celdas de grid:** el contenido largo ensancha su columna y desborda. Usar `minmax(0, 1fr)` y `min-width: 0`. Este bug cortó los datos de la franja del hero en Chrome.
5. **Especificidad:** `.site-header__cta` (una clase) pierde contra `.btn` (una clase) si `components.css` carga después. Cualificar: `.site-header__cta.btn`. Esto tuvo al botón de consulta visible en móvil, comiéndose la barra y expulsando el menú fuera de la pantalla.
6. **Orden de la cascada:** una regla `display: none` escrita al final del archivo pisa al `display: flex` de una media query anterior con la misma especificidad. Ocultar en escritorio con `@media (min-width: …)`, no con una regla suelta al final.
7. **Pseudo-elementos compartidos:** `.page-hero` y `.grid-texture` conviven en la misma etiqueta. Si las dos usan `::after`, sus propiedades se mezclan. La barra dorada acabó clavada en el techo de la página por heredar el `top: 0` de la retícula.
8. **`img { max-width: 100% }` global + altura fija:** aplasta el logo cuando su caja se estrecha. Solución: `object-fit: contain`.

---

## 7. Pendiente

### Del cliente (bloquea el sitio)
- Enlaces de redes sociales. Hoy los iconos del pie no llevan a ninguna parte.
- Proyectos reales. La página `/projects` muestra fichas de ejemplo con la palabra "Placeholder". Es la página más urgente.
- Descripciones largas de los 10 servicios.
- Biografías de los directores y certificaciones.
- Redacción precisa de la participación indígena.
- Fotografías propias.
- Cuenta de Google de la empresa, para el traspaso de Search Console.
- Contenido del asistente virtual (chatbot).

Todo esto está detallado, en lenguaje de negocio, en el documento de solicitud de información entregado a la dirección.

### Técnico
- Google Analytics: hay un placeholder `G-XXXXXXXXXX`. Decisión del cliente.
- `pavel@northalliancegroup.ca` ya figura en el pie de página.
- Protección de ramas en el repositorio antes de la entrega.
- Aviso de privacidad: el sitio recoge datos por dos formularios.
- El formulario de empleo no admite archivos adjuntos (limitación del plan gratuito de Web3Forms).
