import './style.css';
import { generateCode128SVG } from './barcode.ts';
import {  exportToPerfectSVG } from './exportToSvg';

// Generador de códigos secuenciales
function generateCodes(base: string, count: number): string[] {
  const codes: string[] = [];
  for (let i = 1; i <= count; i++) {
    const suffix = i.toString().padStart(4, '0');
    codes.push(`${base}${suffix}`);
  }
  return codes;
}

async function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = '';

  // Crear contenedor de la hoja
  const page = document.createElement('div');
  page.classList.add('page');
  app.appendChild(page);

  // Tamaños y márgenes
  const barcodeWidth = 80;
  const barcodeHeight = 30;
  const marginX = 5;
  const marginY = 5;
  const spaceX = barcodeWidth + marginX;
  const spaceY = barcodeHeight + marginY;

  const pageWidth = 1000;
  const pageHeight = 1000;
  const cols = Math.floor(pageWidth / spaceX);  // 11
  const rows = Math.floor(pageHeight / spaceY); // 28
  const total = cols * rows;                    // 308

  // Generar los códigos
  const codes = generateCodes('00001', total);

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];

    const col = i % cols;
    const row = Math.floor(i / cols);

    const svgString = await generateCode128SVG(code);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement;

    svgElement.setAttribute('width', `${barcodeWidth}mm`);
    svgElement.setAttribute('height', `${barcodeHeight}mm`);

    svgElement.style.position = 'absolute';
    svgElement.style.left = `${col * spaceX}mm`;
    svgElement.style.top = `${row * spaceY}mm`;

    page.appendChild(svgElement);

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Exportar a SVG';
  exportBtn.style.position = 'fixed';
  exportBtn.style.top = '10px';
  exportBtn.style.right = '10px';
  exportBtn.style.zIndex = '1000';
  exportBtn.addEventListener('click', exportToPerfectSVG);
  document.body.appendChild(exportBtn);

    
  }
}

render();
