import bwipjs from 'bwip-js/browser';

export async function generateCode128SVG(code: string): Promise<string> {
  const padding = 2.5; // mm
  const totalWidth = 80; // mm
  const totalHeight = 30; // mm
  const approxCharWidthMM = 2.5;

  // Calcular scaleX para ajustarse al ancho total
  const scaleX = Math.floor((totalWidth - 2 * padding) / (code.length * approxCharWidthMM));

  return await bwipjs.toSVG({
    bcid: 'code128',
    text: code,
    scaleX,
    scaleY: 2,
    includetext: true,
    textxalign: 'center',
    textyoffset: 4,          // ← Añadido: separa texto de barras
    paddingwidth: padding,
    paddingheight: padding,
    height: 18,              // ← Altura solo de las barras (sin texto)
  });
}
