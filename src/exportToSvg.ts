export async function exportToPerfectSVG() {
    const page = document.querySelector('.page')!;
    const barcodes = Array.from(page.querySelectorAll('svg'));
  
    // 1. Encabezado SVG válido
    let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink"
       width="1000mm" 
       height="1000mm"
       viewBox="0 0 1000 1000">
    <rect width="100%" height="100%" fill="white"/>
  `;
  
    // 2. Procesar cada código de barras
    barcodes.forEach(svg => {
      const x = parseFloat(svg.style.left);
      const y = parseFloat(svg.style.top);
      const content = cleanSVGContent(svg.innerHTML);
  
      svgContent += `
    <g transform="translate(${x},${y})">
      ${content}
    </g>`;
    });
  
    // 3. Cierre del SVG
    svgContent += `</svg>`;
  
    // 4. Validación adicional
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const errors = doc.querySelectorAll('parsererror');
    if (errors.length > 0) {
      throw new Error("Error en la generación del SVG");
    }
  
    // 5. Descarga del archivo
    downloadSVG(svgContent, 'barcodes_export.svg');
  }
  
  // Función auxiliar para limpiar el contenido SVG
  function cleanSVGContent(content: string): string {
    return content
      .replace(/<!--.*?-->/g, '') // Elimina comentarios
      .replace(/<\?xml.*?\?>/g, '') // Elimina declaraciones XML internas
      .trim();
  }
  
  // Función mejorada para descargar SVG
  function downloadSVG(content: string, filename: string) {
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }