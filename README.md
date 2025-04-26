# Barcode Assets Generator

Este proyecto es una aplicación web que genera códigos de barras en formato SVG y permite exportarlos como un archivo descargable. Los códigos de barras se generan dinámicamente y se organizan en una grilla dentro de un elemento SVG.

## Características

- Generación de códigos de barras en formato **Code128**.
- Organización automática de los códigos de barras en una grilla dentro de un canvas SVG.
- Exportación del canvas SVG como un archivo descargable.
- Diseño responsivo y minimalista.

## Tecnologías utilizadas

- **TypeScript**: Para la lógica de generación de códigos de barras y manipulación del DOM.
- **bwip-js**: Biblioteca para generar códigos de barras en formato SVG.
- **HTML5**: Estructura de la aplicación.
- **CSS3**: Estilos para el diseño de la interfaz.
- **DOM API**: Para manipular dinámicamente el contenido del SVG.

## Estructura del proyecto

- `index.html`: Archivo principal que contiene la estructura HTML de la aplicación.
- `style.css`: Archivo de estilos para la interfaz de usuario.
- `src/main.ts`: Archivo TypeScript que contiene la lógica de generación de códigos de barras y exportación del SVG.

## Cómo funciona

1. **Generación de códigos de barras**:

   - Los códigos de barras se generan utilizando la función `generateBarcode`, que toma como parámetros:
     - `article`: Código del artículo (número entero).
     - `series`: Cantidad de series a generar.
     - `start`: Número inicial de la serie (opcional, por defecto es 1).
   - Los códigos generados se organizan en una grilla dentro de un elemento SVG.

2. **Exportación del SVG**:
   - Al hacer clic en el botón "exportar svg", el contenido del canvas SVG se serializa y se descarga como un archivo `.svg`.

## Cómo usar

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd barcode-assets
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
