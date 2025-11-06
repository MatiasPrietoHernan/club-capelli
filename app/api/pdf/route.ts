// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { verify } from "jsonwebtoken"

// Interfaces TypeScript
interface Producto {
  name: string;
  price: number;
  quantity: number;
}

interface DatosCliente {
  nombre?: string;
  direccion?: string;
  cuit?: string;
  email?: string;
}

interface DatosEmpresa {
  nombre?: string;
  direccion?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
}

interface RequestBody {
  productos: Producto[];
  cliente?: DatosCliente;
  empresa?: DatosEmpresa;
  numeroFactura?: string;
  fecha?: string;
}

export async function POST(request: NextRequest) {

  const token = request.headers.get("Authorization")?.split(" ")[1]
  const secretKey = process.env.NEXTAUTH_SECRET ?? "";
  
  console.log("Aqui esta el tokenx", token)

  if (!token?.trim()) return NextResponse.json({ message: "Token no encontrado" }, { status: 400 })


  try {
    const decode = verify(token, secretKey);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 401 });
  }


  try {
    const body: RequestBody = await request.json();

    // Validar que existan productos
    if (!body.productos || !Array.isArray(body.productos) || body.productos.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de productos válido' },
        { status: 400 }
      );
    }

    // Datos por defecto
    const datosEmpresa = {
      nombre: body.empresa?.nombre || 'Cristal Shop',
      direccion: body.empresa?.direccion || 'Dirección: Villafañe 75, Perico, Jujuy, Argentina 4610',
      cuit: body.empresa?.cuit || '00-00000000-00',
      telefono: body.empresa?.telefono || '+54 9 388 505-1954',
      email: body.empresa?.email || 'cristalshop@gmail.com'
    };

    const datosCliente = {
      nombre: body.cliente?.nombre || '---------',
      direccion: body.cliente?.direccion || '---------',
      cuit: body.cliente?.cuit || '---------',
      email: body.cliente?.email || '---------'
    };

    const numeroFactura = body.numeroFactura || `001-${Date.now().toString().slice(-6)}`;
    const fecha = body.fecha || new Date().toLocaleDateString('es-AR');

    // Crear el PDF
    const doc = new jsPDF();

    // Configurar fuente
    doc.setFont('helvetica');

    // Header con fondo verde
    doc.setFillColor(26, 95, 63); // Verde oscuro #1a5f3f
    doc.rect(0, 0, 210, 45, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text('FACTURA', 105, 25, { align: 'center' });

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);

    // Información de la empresa (izquierda)
    doc.setFontSize(14);
    doc.setTextColor(26, 95, 63);
    doc.text('DATOS DE LA EMPRESA', 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(datosEmpresa.nombre, 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(datosEmpresa.direccion, 20, 77);
    doc.text(`Tel: ${datosEmpresa.telefono}`, 20, 84);
    doc.text(`Email: ${datosEmpresa.email}`, 20, 91);
    doc.setFont('helvetica', 'bold');
    doc.text(`CUIT: ${datosEmpresa.cuit}`, 20, 98);

    // Información del cliente (derecha)
    doc.setFontSize(14);
    doc.setTextColor(26, 95, 63);
    doc.text('FACTURAR A:', 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(datosCliente.nombre, 120, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(datosCliente.direccion, 120, 77);
    doc.text(`Email: ${datosCliente.email}`, 120, 84);
    doc.setFont('helvetica', 'bold');
    doc.text(`CUIT: ${datosCliente.cuit}`, 120, 91);

    // Detalles de la factura
    doc.setFillColor(248, 249, 250);
    doc.rect(15, 105, 180, 20, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 95, 63);
    doc.text(`Factura #${numeroFactura}`, 20, 115);
    doc.text(`Fecha: ${fecha}`, 20, 122);


    // Preparar datos para la tabla
    const tableData = body.productos.map(producto => [
      producto.quantity.toString(),
      producto.name,
      `$${producto.price.toLocaleString('es-AR')}`,
      `$${(producto.price * producto.quantity).toLocaleString('es-AR')}`
    ]);

    // Tabla de productos - Usando autoTable importado
    autoTable(doc, {
      startY: 135,
      head: [['Cant.', 'Descripción', 'Precio Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 95, 63],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 25 },
        1: { halign: 'left', cellWidth: 90 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 }
      },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 15, right: 15 },
      styles: {
        minCellHeight: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      }
    });

    // Calcular totales
    const subtotal = body.productos.reduce((sum, producto) =>
      sum + (producto.price * producto.quantity), 0
    );
    const descuento = subtotal * 0.05; // 5% descuento
    const subtotalConDescuento = subtotal - descuento;
    const iva = subtotalConDescuento * 0.21; // 21% IVA
    const total = subtotalConDescuento + iva;

    // Obtener la posición Y final de la tabla anterior
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Tabla de totales (solo subtotal)
    autoTable(doc, {
      startY: finalY,
      body: [
        ['Subtotal:', `${subtotal.toLocaleString('es-AR')}`]
      ],
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 5
      },
      bodyStyles: {
        fontSize: 11
      },
      columnStyles: {
        0: { halign: 'right', fontStyle: 'bold', cellWidth: 40 },
        1: { halign: 'right', cellWidth: 40 }
      },
      margin: { left: 115 }
    });

    const totalFinalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(26, 95, 63);
    doc.rect(115, totalFinalY - 7, 80, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR:', 125, totalFinalY - 1);
    doc.text(`${subtotal.toLocaleString('es-AR')}`, 185, totalFinalY - 1, { align: 'right' });

    const notesY = totalFinalY + 15;


    // Footer
    const footerY = notesY + 35;
    doc.setFillColor(26, 95, 63);
    doc.rect(0, footerY, 210, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('¡Gracias por confiar en nosotros!', 105, footerY + 8, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Este documento fue generado automáticamente', 105, footerY + 15, { align: 'center' });

    // Generar el PDF como buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="factura_${numeroFactura.replace('-', '_')}.pdf"`);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al generar PDF' },
      { status: 500 }
    );
  }
}

// Método GET para documentación de la API
export async function GET() {
  return NextResponse.json({
    message: 'API para generar facturas en PDF',
    endpoint: '/api/generate-pdf',
    method: 'POST',
    ejemplo: {
      productos: [
        { name: "Producto 1", price: 1500, quantity: 2 },
        { name: "Producto 2", price: 2500, quantity: 1 }
      ],
      cliente: {
        nombre: "Cliente Ejemplo",
        direccion: "Av. Cliente 456",
        cuit: "23-87654321-4",
        email: "cliente@email.com"
      },
      empresa: {
        nombre: "Mi Empresa S.A.",
        direccion: "Calle Principal 123",
        cuit: "20-12345678-9"
      },
      numeroFactura: "001-001234",
      fecha: "26/06/2025"
    }
  });
}