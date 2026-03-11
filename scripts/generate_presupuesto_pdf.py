#!/usr/bin/env python3
# ============================================
# CHIACCHIO - Generador de PDF Presupuesto
# ============================================

import sys
import os
import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.pdfbase import pdfmetrics



# Colores
PRIMARY = HexColor('#1e3a5f')
ACCENT = HexColor('#2563eb')
LIGHT_GRAY = HexColor('#f3f4f6')
DARK_GRAY = HexColor('#6b7280')

def format_price(price):
    """Formatear precio en pesos argentinos"""
    try:
        val = float(price)
        return f"${val:,.0f}".replace(",", ".")
    except:
        return "$0"

def format_date_es(date_str):
    """Formatear fecha en español"""
    try:
        if not date_str:
            return ''
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        return f"{dt.day} de {months[dt.month-1]} de {dt.year}"
    except:
        return date_str

def generate_presupuesto_pdf(presupuesto_json, output_path):
    """Generar PDF de presupuesto"""

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=1.5*cm,
        bottomMargin=1.5*cm
    )

    story = []
    styles = getSampleStyleSheet()

    # Estilos
    title_style = ParagraphStyle(
        'Title',
        fontName='Times-Roman',
        fontSize=28,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'Subtitle',
        fontName='Times-Roman',
        fontSize=12,
        textColor=DARK_GRAY,
        alignment=TA_CENTER,
        spaceAfter=20
    )

    center_style = ParagraphStyle(
        'Center',
        fontName='Times-Roman',
        fontSize=9,
        textColor=DARK_GRAY,
        alignment=TA_CENTER
    )

    label_style = ParagraphStyle(
        'Label',
        fontName='Times-Roman',
        fontSize=10,
        textColor=DARK_GRAY,
    )

    value_style = ParagraphStyle(
        'Value',
        fontName='Times-Roman',
        fontSize=11,
        textColor=black,
    )

    header_cell = ParagraphStyle(
        'HeaderCell',
        fontName='Times-Roman',
        fontSize=10,
        textColor=white,
        alignment=TA_CENTER
    )

    body_cell = ParagraphStyle(
        'BodyCell',
        fontName='Times-Roman',
        fontSize=10,
        textColor=black,
    )

    body_cell_right = ParagraphStyle(
        'BodyCellRight',
        fontName='Times-Roman',
        fontSize=10,
        textColor=black,
        alignment=TA_RIGHT
    )

    # ===== MEMBRETE =====
    logo_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'logo-chiacchio.png')
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=3.5*cm, height=3.5*cm)
        logo.hAlign = 'LEFT'
        story.append(logo)
        story.append(Spacer(1, 8))
    else:
        story.append(Paragraph('<b>CHIACCHIO</b>', title_style))
    story.append(Paragraph('Servicios de Mantenimiento Electrico', subtitle_style))
    story.append(Paragraph('Tel: +54 9 221 601-1455 | La Plata, Buenos Aires', center_style))
    story.append(Spacer(1, 15))

    # Línea separadora
    line_table = Table([['']], colWidths=[17*cm], rowHeights=[3])
    line_table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), PRIMARY)]))
    story.append(line_table)
    story.append(Spacer(1, 25))

    # ===== TITULO PRESUPUESTO =====
    pres_title = ParagraphStyle('PresTitle', fontName='Times-Roman', fontSize=18,
                                textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=25)
    story.append(Paragraph(f'<b>PRESUPUESTO N° {presupuesto_json.get("numero", "")}</b>', pres_title))

    # ===== DATOS DEL CLIENTE =====
    cliente = presupuesto_json.get('cliente', {}) or {}
    cliente_nombre = presupuesto_json.get('clienteNombre') or f"{cliente.get('nombre', '')} {cliente.get('apellido', '')}".strip()
    cliente_direccion = presupuesto_json.get('clienteDireccion') or cliente.get('direccion', '-')
    cliente_telefono = presupuesto_json.get('clienteTelefono') or cliente.get('telefono', '-')
    cliente_email = presupuesto_json.get('clienteEmail') or cliente.get('email', '')

    info_data = [
        [Paragraph('<b>Cliente:</b>', label_style), Paragraph(cliente_nombre or '-', value_style)],
        [Paragraph('<b>Direccion:</b>', label_style), Paragraph(cliente_direccion, value_style)],
        [Paragraph('<b>Telefono:</b>', label_style), Paragraph(cliente_telefono, value_style)],
    ]
    if cliente_email:
        info_data.append([Paragraph('<b>Email:</b>', label_style), Paragraph(cliente_email, value_style)])

    info_table = Table(info_data, colWidths=[3*cm, 14*cm])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 15))

    # Lugar y fecha
    lugar = presupuesto_json.get('lugar', 'La Plata')
    fecha = presupuesto_json.get('fecha', '')
    lugar_fecha = f'{lugar}, {format_date_es(fecha)}'
    story.append(Paragraph(lugar_fecha, ParagraphStyle('LugarFecha', fontName='Times-Roman',
                                                        fontSize=11, textColor=DARK_GRAY, alignment=TA_RIGHT)))
    story.append(Spacer(1, 25))

    # ===== TABLA DE ITEMS =====
    items_header = [
        Paragraph('<b>Item</b>', header_cell),
        Paragraph('<b>Descripcion</b>', header_cell),
        Paragraph('<b>Cant.</b>', header_cell),
        Paragraph('<b>Precio Unit.</b>', header_cell),
        Paragraph('<b>Subtotal</b>', header_cell),
    ]

    items_data = [items_header]
    items = presupuesto_json.get('items', [])
    for idx, item in enumerate(items, 1):
        items_data.append([
            Paragraph(str(idx), body_cell),
            Paragraph(item.get('descripcion', ''), body_cell),
            Paragraph(str(item.get('cantidad', 1)), ParagraphStyle('C', parent=body_cell, alignment=TA_CENTER)),
            Paragraph(format_price(item.get('precioUnitario', 0)), body_cell_right),
            Paragraph(format_price(item.get('subtotal', 0)), body_cell_right),
        ])

    items_table = Table(items_data, colWidths=[1.2*cm, 8*cm, 1.8*cm, 3*cm, 3*cm])
    items_table.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        # Body
        ('BACKGROUND', (0, 1), (-1, -1), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GRAY]),
        # Borders
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#d1d5db')),
        ('BOX', (0, 0), (-1, -1), 1.5, PRIMARY),
        # Padding
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 25))

    # ===== TOTALES =====
    subtotal = presupuesto_json.get('subtotal', 0)
    desc_pct = float(presupuesto_json.get("descuentoPorcentaje", 0) or 0)
    desc_monto = float(presupuesto_json.get("descuentoMonto", 0) or 0)
    total = presupuesto_json.get('total', 0)
    financiacion = presupuesto_json.get('financiacion', 'contado')

    totals_right = ParagraphStyle('TR', fontName='Times-Roman', fontSize=11, alignment=TA_RIGHT)

    totals_data = [
        ['', Paragraph('<b>Subtotal:</b>', totals_right), Paragraph(format_price(subtotal), body_cell_right)],
    ]

    if desc_pct > 0:
        totals_data.append(['',
                           Paragraph(f'<b>Descuento ({desc_pct}%):</b>', ParagraphStyle('TRG', fontName='Times-Roman', fontSize=11, alignment=TA_RIGHT, textColor=HexColor('#059669'))),
                           Paragraph(f'- {format_price(desc_monto)}', ParagraphStyle('GR', parent=body_cell_right, textColor=HexColor('#059669')))])

    total_style = ParagraphStyle('Total', fontName='Times-Roman', fontSize=14, textColor=PRIMARY, alignment=TA_RIGHT)
    totals_data.append(['',
                       Paragraph('<b>TOTAL:</b>', total_style),
                       Paragraph(format_price(total), total_style)])

    # Financiación
    if financiacion == '3_cuotas':
        totals_data.append(['', Paragraph('<b>3 cuotas de:</b>', totals_right),
                           Paragraph(format_price(total / 3), body_cell_right)])
    elif financiacion == '6_cuotas':
        totals_data.append(['', Paragraph('<b>6 cuotas de:</b>', totals_right),
                           Paragraph(format_price(total / 6), body_cell_right)])
    elif financiacion == 'acuerdo':
        totals_data.append(['', Paragraph('<b>Financiacion:</b>', totals_right),
                           Paragraph('A convenir', body_cell_right)])

    totals_table = Table(totals_data, colWidths=[8*cm, 4.5*cm, 4.5*cm])
    totals_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEABOVE', (1, -2), (-1, -2), 1, PRIMARY),
    ]))
    story.append(totals_table)
    story.append(Spacer(1, 35))

    # ===== NOTAS =====
    notas = presupuesto_json.get('notas', '')
    if notas:
        story.append(Paragraph('<b>Notas:</b>', label_style))
        story.append(Paragraph(notas, ParagraphStyle('Notas', fontName='Times-Roman', fontSize=10)))
        story.append(Spacer(1, 25))

    # ===== FIRMAS =====
    story.append(Spacer(1, 30))

    firma_style = ParagraphStyle('Firma', fontName='Times-Roman', fontSize=10, alignment=TA_CENTER)

    firmas_data = [
        [Paragraph('_', firma_style), '', Paragraph('_', firma_style)],
        [Paragraph('<b>CHIACCHIO</b>', firma_style), '', Paragraph('<b>CLIENTE</b>', firma_style)],
        [Paragraph('Fecha: _______________', firma_style), '', Paragraph('Fecha: _______________', firma_style)],
        [Paragraph('Aclaracion: ____________', firma_style), '', Paragraph('Aclaracion: ____________', firma_style)],
        [Paragraph('DNI: ________________', firma_style), '', Paragraph('DNI: ________________', firma_style)],
    ]

    firmas_table = Table(firmas_data, colWidths=[6*cm, 5*cm, 6*cm])
    firmas_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(firmas_table)
    story.append(Spacer(1, 25))

    # ===== FOOTER =====
    footer_style = ParagraphStyle('Footer', fontName='Times-Roman', fontSize=8,
                                  textColor=HexColor('#9ca3af'), alignment=TA_CENTER)
    story.append(Paragraph('Presupuesto valido por 30 dias. Condiciones sujetas a verificacion tecnica in situ.',
                          footer_style))

    # Build
    doc.build(story)
    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Uso: python generate_presupuesto_pdf.py <presupuesto_json> <output_path>")
        sys.exit(1)

    json_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(json_path, "r", encoding="utf-8-sig") as f:
        presupuesto = json.load(f)

    generate_presupuesto_pdf(presupuesto, output_path)

