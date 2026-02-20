/* ============================================
   CHIACCHIO - API Generador de PDF Presupuesto
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

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

    // Convertir Decimal a number para JSON
    const presupuestoJson = JSON.stringify({
      ...presupuesto,
      subtotal: Number(presupuesto.subtotal),
      descuentoPorcentaje: Number(presupuesto.descuentoPorcentaje),
      descuentoMonto: Number(presupuesto.descuentoMonto),
      total: Number(presupuesto.total),
      items: presupuesto.items.map((item) => ({
        ...item,
        cantidad: Number(item.cantidad),
        precioUnitario: Number(item.precioUnitario),
        subtotal: Number(item.subtotal),
      })),
    });

    // Generar nombre de archivo único
    const fileName = `Presupuesto_${presupuesto.numero}_${Date.now()}.pdf`;
    const outputPath = path.join('/home/z/my-project/download', fileName);

    // Ejecutar script Python
    const scriptPath = '/home/z/my-project/scripts/generate_presupuesto_pdf.py';

    // Crear archivo temporal con JSON
    const jsonTempPath = `/tmp/presupuesto_${Date.now()}.json`;
    fs.writeFileSync(jsonTempPath, presupuestoJson);

    try {
      execSync(`python3 ${scriptPath} '${presupuestoJson}' ${outputPath}`, {
        encoding: 'utf-8',
        timeout: 30000,
      });

      // Leer PDF generado
      const pdfBuffer = fs.readFileSync(outputPath);

      // Limpiar archivo temporal
      fs.unlinkSync(jsonTempPath);
      fs.unlinkSync(outputPath);

      // Devolver PDF
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Presupuesto_${presupuesto.numero}.pdf"`,
        },
      });
    } catch (execError) {
      console.error('Error executing Python script:', execError);
      // Limpiar archivos temporales
      if (fs.existsSync(jsonTempPath)) fs.unlinkSync(jsonTempPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      throw execError;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
