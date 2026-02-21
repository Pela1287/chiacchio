/* ============================================
   CHIACCHIO - API Generador de PDF Presupuesto
   Usa pdfkit (JavaScript puro, sin Python)
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { presupuestoId } = await request.json();

    if (!presupuestoId) {
      return NextResponse.json(
        { error: 'ID de presupuesto requerido' },
        { status: 400 }
      );
    }

    // Obtener presupuesto con items
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
      include: {
        cliente: true,
        items: true,
      },
    });

    if (!presupuesto) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      );
    }

    // Generar PDF con pdfkit
    const pdfBuffer = await generatePDF(presupuesto);

    // Devolver PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Presupuesto_${presupuesto.numero}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}

async function generatePDF(presupuesto: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colores
      const primaryColor = '#1e3a5f';
      const grayColor = '#6b7280';
      const lightGray = '#f3f4f6';

      // ===== MEMBRETE =====
      doc.fillColor(primaryColor)
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('CHIACCHIO', { align: 'center' });
      
      doc.fillColor(grayColor)
         .fontSize(12)
         .font('Helvetica')
         .text('Servicios de Mantenimiento Electrico', { align: 'center' });
      
      doc.fontSize(9)
         .text('Tel: +54 9 221 601-1455 | La Plata, Buenos Aires', { align: 'center' });
      
      doc.moveDown(0.5);
      
      // Línea separadora
      doc.save()
         .moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .lineWidth(2)
         .strokeColor(primaryColor)
         .stroke()
         .restore();
      
      doc.moveDown(1.5);

      // ===== TITULO PRESUPUESTO =====
      doc.fillColor(primaryColor)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text(`PRESUPUESTO N° ${presupuesto.numero}`, { align: 'center' });
      
      doc.moveDown(1.5);

      // ===== DATOS DEL CLIENTE =====
      const cliente = presupuesto.cliente || {};
      const clienteNombre = presupuesto.clienteNombre || `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim() || '-';
      const clienteDireccion = presupuesto.clienteDireccion || cliente.direccion || '-';
      const clienteTelefono = presupuesto.clienteTelefono || cliente.telefono || '-';
      const clienteEmail = presupuesto.clienteEmail || cliente.email || '';

      doc.fillColor(grayColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Cliente: ', { continued: true })
         .font('Helvetica')
         .fillColor('#000')
         .text(clienteNombre);
      
      doc.fillColor(grayColor)
         .font('Helvetica-Bold')
         .text('Direccion: ', { continued: true })
         .font('Helvetica')
         .fillColor('#000')
         .text(clienteDireccion);
      
      doc.fillColor(grayColor)
         .font('Helvetica-Bold')
         .text('Telefono: ', { continued: true })
         .font('Helvetica')
         .fillColor('#000')
         .text(clienteTelefono);
      
      if (clienteEmail) {
        doc.fillColor(grayColor)
           .font('Helvetica-Bold')
           .text('Email: ', { continued: true })
           .font('Helvetica')
           .fillColor('#000')
           .text(clienteEmail);
      }

      doc.moveDown(0.5);

      // Lugar y fecha
      const lugar = presupuesto.lugar || 'La Plata';
      const fecha = presupuesto.fecha ? formatDateES(presupuesto.fecha) : '';
      doc.fillColor(grayColor)
         .fontSize(11)
         .text(`${lugar}, ${fecha}`, { align: 'right' });

      doc.moveDown(1.5);

      // ===== TABLA DE ITEMS =====
      const tableTop = doc.y;
      const colWidths = [30, 250, 50, 80, 80]; // Item, Descripcion, Cant, Precio, Subtotal
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
      const startX = 50;

      // Header de la tabla
      doc.fillColor('#fff')
         .rect(startX, tableTop, tableWidth, 25)
         .fill(primaryColor);
      
      doc.fillColor('#fff')
         .fontSize(10)
         .font('Helvetica-Bold');
      
      let xPos = startX + 5;
      doc.text('Item', xPos, tableTop + 8, { width: colWidths[0] - 10 });
      xPos += colWidths[0];
      doc.text('Descripcion', xPos, tableTop + 8, { width: colWidths[1] - 10 });
      xPos += colWidths[1];
      doc.text('Cant.', xPos, tableTop + 8, { width: colWidths[2] - 10, align: 'center' });
      xPos += colWidths[2];
      doc.text('Precio Unit.', xPos, tableTop + 8, { width: colWidths[3] - 10, align: 'right' });
      xPos += colWidths[3];
      doc.text('Subtotal', xPos, tableTop + 8, { width: colWidths[4] - 10, align: 'right' });

      let rowY = tableTop + 25;
      
      // Filas de items
      doc.fillColor('#000')
         .font('Helvetica')
         .fontSize(10);

      const items = presupuesto.items || [];
      items.forEach((item: any, idx: number) => {
        // Alternar color de fondo
        if (idx % 2 === 1) {
          doc.fillColor(lightGray)
             .rect(startX, rowY, tableWidth, 22)
             .fill();
        }

        doc.fillColor('#000');
        let xPos = startX + 5;
        doc.text(String(idx + 1), xPos, rowY + 6, { width: colWidths[0] - 10 });
        xPos += colWidths[0];
        doc.text(item.descripcion || '', xPos, rowY + 6, { width: colWidths[1] - 10 });
        xPos += colWidths[1];
        doc.text(String(item.cantidad || 1), xPos, rowY + 6, { width: colWidths[2] - 10, align: 'center' });
        xPos += colWidths[2];
        doc.text(formatPrice(item.precioUnitario || 0), xPos, rowY + 6, { width: colWidths[3] - 10, align: 'right' });
        xPos += colWidths[3];
        doc.text(formatPrice(item.subtotal || 0), xPos, rowY + 6, { width: colWidths[4] - 10, align: 'right' });

        rowY += 22;
      });

      // Borde de la tabla
      doc.save()
         .rect(startX, tableTop, tableWidth, rowY - tableTop)
         .lineWidth(1)
         .strokeColor(primaryColor)
         .stroke()
         .restore();

      doc.y = rowY + 20;

      // ===== TOTALES =====
      const subtotal = Number(presupuesto.subtotal) || 0;
      const descPct = Number(presupuesto.descuentoPorcentaje) || 0;
      const descMonto = Number(presupuesto.descuentoMonto) || 0;
      const total = Number(presupuesto.total) || 0;
      const financiacion = presupuesto.financiacion || 'contado';

      const totalsX = startX + colWidths[0] + colWidths[1];
      const totalsWidth = colWidths[2] + colWidths[3] + colWidths[4];

      doc.fontSize(11);
      
      // Subtotal
      doc.fillColor('#000')
         .font('Helvetica')
         .text('Subtotal:', totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
      doc.text(formatPrice(subtotal), totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });
      doc.moveDown(0.3);

      // Descuento
      if (descPct > 0) {
        doc.fillColor('#059669')
           .text(`Descuento (${descPct}%):`, totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
        doc.text(`- ${formatPrice(descMonto)}`, totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });
        doc.moveDown(0.3);
      }

      // Línea
      doc.save()
         .moveTo(totalsX, doc.y + 5)
         .lineTo(totalsX + totalsWidth, doc.y + 5)
         .lineWidth(1)
         .strokeColor(primaryColor)
         .stroke()
         .restore();

      doc.moveDown(0.5);

      // Total
      doc.fillColor(primaryColor)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('TOTAL:', totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
      doc.text(formatPrice(total), totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });

      doc.moveDown(0.5);

      // Financiación
      doc.fillColor('#000')
         .fontSize(11)
         .font('Helvetica');
      
      if (financiacion === '3_cuotas') {
        doc.text('3 cuotas de:', totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
        doc.text(formatPrice(total / 3), totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });
      } else if (financiacion === '6_cuotas') {
        doc.text('6 cuotas de:', totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
        doc.text(formatPrice(total / 6), totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });
      } else if (financiacion === 'acuerdo') {
        doc.text('Financiacion:', totalsX, doc.y, { width: totalsWidth - 100, align: 'right' });
        doc.text('A convenir', totalsX + totalsWidth - 90, doc.y, { width: 80, align: 'right' });
      }

      doc.moveDown(2);

      // ===== NOTAS =====
      if (presupuesto.notas) {
        doc.fillColor(grayColor)
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('Notas:');
        doc.fillColor('#000')
           .font('Helvetica')
           .text(presupuesto.notas);
        doc.moveDown(1);
      }

      // ===== FIRMAS =====
      doc.moveDown(2);
      
      const firmaY = doc.y;
      const firmaWidth = 150;
      const firmaSpacing = 100;

      // Firma empresa
      doc.fillColor('#000')
         .fontSize(10)
         .text('_', startX + firmaWidth / 2 - 20, firmaY, { width: 40, align: 'center' });
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold')
         .text('CHIACCHIO', startX, doc.y, { width: firmaWidth, align: 'center' });
      doc.font('Helvetica')
         .text('Fecha: ____________', startX, doc.y + 15, { width: firmaWidth, align: 'center' });
      doc.text('Aclaracion: ____________', startX, doc.y + 15, { width: firmaWidth, align: 'center' });

      // Firma cliente
      const firmaClienteX = startX + firmaWidth + firmaSpacing + firmaWidth / 2 - 20;
      doc.text('_', firmaClienteX - 20, firmaY, { width: 40, align: 'center' });
      doc.font('Helvetica-Bold')
         .text('CLIENTE', startX + firmaWidth + firmaSpacing, firmaY + 15, { width: firmaWidth, align: 'center' });
      doc.font('Helvetica')
         .text('Fecha: ____________', startX + firmaWidth + firmaSpacing, doc.y + 15, { width: firmaWidth, align: 'center' });
      doc.text('Aclaracion: ____________', startX + firmaWidth + firmaSpacing, doc.y + 15, { width: firmaWidth, align: 'center' });

      // ===== FOOTER =====
      doc.moveDown(2);
      doc.fillColor('#9ca3af')
         .fontSize(8)
         .text('Presupuesto valido por 30 dias. Condiciones sujetas a verificacion tecnica in situ.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDateES(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}
