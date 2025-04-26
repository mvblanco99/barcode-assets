import bwipjs from "bwip-js/browser";

// refs al DOM
const canvas = document.getElementById("canvas");
if (!(canvas instanceof SVGSVGElement) || !canvas) {
  throw new Error('Element with id "canvas" is not an SVGSVGElement');
}
const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;

// Esta funcion recibe dos argumentos obligatorios y uno opcional: 
// 1. el codigo del articulo el cual es un entero
// 2. cantidad de series a generar: es un entero que indica cuantas series de ese articulo se van a imprimir
// 3. Indica desde que numero se empieza a contar las series, por defecto es 1
// Ambos argumentos se concatenan para formar el codigo de barras
// Ejemplo: si el articulo es 1 y la cantidad de series es 2, la funcion devuelve: 00001000001 y 00001000002 , donde los primeros 5 digitos son el articulo y los siguientes 6 son la serie
function generateBarcode(article: number, series: number, start: number = 1): string[] {
  const barcodes: string[] = [];
  const articleStr = String(article).padStart(5, "0");
  for (let i = start; i < start + series; i++) {
    const seriesStr = String(i).padStart(6, "0");
    const barcode = `${articleStr}${seriesStr}`;
    barcodes.push(barcode);
  }
  return barcodes;
}

function initCanvas() {
  if (!canvas) {
    throw new Error("Canvas element not found");
  }
  // definimos el tamaño real en mm
  canvas.setAttribute("width", "1000mm");
  canvas.setAttribute("height", "1000mm");
  // canvas.setAttribute("viewBox", "0 0 2000 2000");
}

async function addBarcodes() {
  if (!canvas) {
    throw new Error("Canvas element not found");
  }
  const pitchX = 85; // separación horizontal (mm)
  const pitchY = 35; // separación vertical (mm)
  let x = 0;
  let y = 0;

  const barcodeList = generateBarcode(1, 300, 1); // Genera 10 series del articulo 1

  for (const text of barcodeList) {
    // opts de Code128
    const opts: bwipjs.RenderOptions = {
      bcid: "code128",
      textxalign: 'center',
      textyoffset: 3,
      text,
      width: 80, // mm
      height: 30, // mm
      includetext: true,
      paddingtop: 10,
    };
    // genera SVG string
    const svgStr = (bwipjs as any).toSVG(opts);
    const doc = new DOMParser().parseFromString(svgStr, "image/svg+xml");
    const el = doc.documentElement as unknown as SVGSVGElement;

    // lo coloco en la grilla
    el.setAttribute("x", `${x}mm`);
    el.setAttribute("y", `${y}mm`);
    el.setAttribute("width", "85mm");
    el.setAttribute("height", "35mm");
    el.setAttribute("style", "background-color: white;");

    canvas.appendChild(el);

    x += pitchX;
    if (x + 85 > 1000) {
      x = 0;
      y += pitchY;
    }
  }
}

function exportSvg() {
  if (!canvas) {
    throw new Error("Canvas element not found");
  }
  const svgData = new XMLSerializer().serializeToString(canvas);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gigantografia.svg";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", async () => {
  initCanvas();
  await addBarcodes();
  exportBtn.addEventListener("click", exportSvg);
});
