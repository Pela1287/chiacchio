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
import os from 'os';

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

    // Usar carpeta temporal del sistema (funciona en Windows y Linux)
    const tmpDir = os.tmpdir();
    const fileName = `Presupuesto_${presupuesto.numero}_${Date.now()}.pdf`;
    const outputPath = path.join(tmpDir, fileName);
    const jsonTempPath = path.join(tmpDir, `presupuesto_${Date.now()}.json`);

    // Guardar JSON temporal
    fs.writeFileSync(jsonTempPath, presupuestoJson);

    // Buscar el script de Python
    // Primero intentar en la misma carpeta del proyecto
    const possibleScriptPaths = [
      path.join(process.cwd(), 'scripts', 'generate_presupuesto_pdf.py'),
      path.join(process.cwd(), '..', 'scripts', 'generate_presupuesto_pdf.py'),
      '/home/z/my-project/scripts/generate_presupuesto_pdf.py',
    ];

    let scriptPath = null;
    for (const p of possibleScriptPaths) {
      if (fs.existsSync(p)) {
        scriptPath = p;
        break;
      }
    }

    if (!scriptPath) {
      console.error('Script Python no encontrado');
      return NextResponse.json(
        { error: 'Script de generación PDF no encontrado' },
        { status: 500 }
      );
    }

    try {
      // Ejecutar script Python
      // En Windows, usar python en lugar de python3
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      
      execSync(`"${pythonCmd}" "${scriptPath}" "${presupuestoJson}" "${outputPath}"`, {
        encoding: 'utf-8',
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024, // 10MB
      });

      // Leer PDF generado
      const pdfBuffer = fs.readFileSync(outputPath);

      // Limpiar archivos temporales
      try {
        fs.unlinkSync(jsonTempPath);
        fs.unlinkSync(outputPath);
      } catch (e) {
        // Ignorar errores de limpieza
      }

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
      try {
        if (fs.existsSync(jsonTempPath)) fs.unlinkSync(jsonTempPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {
        // Ignorar errores de limpieza
      }
      return NextResponse.json(
        { error: 'Error al generar el PDF. Verificá que Python esté instalado.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
