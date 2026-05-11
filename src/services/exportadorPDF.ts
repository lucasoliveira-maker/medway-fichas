import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ficha } from '@/types/ficha.types';

export async function exportarFichaPDF(ficha: Ficha, element: HTMLElement): Promise<void> {
  try {
    // Criar canvas da ficha
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
    });

    // Dimensões
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Adicionar imagem ao PDF (múltiplas páginas se necessário)
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Baixar
    const filename = `${ficha.titulo.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw new Error('Erro ao exportar ficha como PDF');
  }
}

export async function exportarFichaDOCX(ficha: Ficha): Promise<void> {
  // TODO: Implementar com docx library
  alert('Exportação DOCX será implementada em breve!');
}
