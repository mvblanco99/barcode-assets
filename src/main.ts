import bwipjs from "bwip-js/browser";

// refs al DOM
const canvas = document.getElementById("canvas");
if (!(canvas instanceof SVGSVGElement) || !canvas) {
  throw new Error('Element with id "canvas" is not an SVGSVGElement');
}
const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;

// Esta función recibe dos argumentos obligatorios y uno opcional:
// 1. el codigo del articulo el cual es un entero
// 2. cantidad de series a generar: es un entero que indica cuantas series de ese articulo se van a imprimir
// 3. Indica desde que numero se empieza a contar las series, por defecto es 1
// Ambos argumentos se concatenan para formar el codigo de barras
// Ejemplo: si el articulo es 1 y la cantidad de series es 2, la función devuelve: 00001000001 y 00001000002 , donde los primeros 5 digitos son el articulo y los siguientes 6 son la serie
function generateBarcode(params: {
  article: number;
  series: number;
  start: number;
}): string[] {
  const { article, series, start = 1 } = params;
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
  canvas.setAttribute("width", "1300mm");
  canvas.setAttribute("height", "2350mm");
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

  const barcodeList = generateBarcode({
    article: 1,
    series: 1000,
    start: 1,
  });

  for (const text of barcodeList) {
    // opts de Code128
    const opts: bwipjs.RenderOptions = {
      bcid: "code128",
      textxalign: "center",
      textyoffset: 4,
      text: text,
      width: 80, // mm
      height: 30, // mm
      includetext: true,
      textsize: 12,
      backgroundcolor: "#fff",
      bordercolor: "#000",
      borderwidth: 0.5,
      borderbottom: 16,
      bordertop: 8,
      showborder: true,
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
    // el.setAttribute("border", "1px solid black");

    canvas.appendChild(el);

    x += pitchX;
    if (x + 85 > 1300) {
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
  link.download = "barcode_articles.svg";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", async () => {
  initCanvas();
  await addBarcodes();
  exportBtn.addEventListener("click", exportSvg);
});
