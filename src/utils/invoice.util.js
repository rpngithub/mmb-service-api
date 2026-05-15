const PDFDocument = require('pdfkit');

function generateInvoicePdf({ user, plan, order, subscription }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const invoiceDate = new Date().toDateString();
    const startDate = new Date(subscription.start_date).toDateString();
    const endDate = new Date(subscription.end_date).toDateString();

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text('MakeMyBrand', { align: 'left' });
    doc.fontSize(11).font('Helvetica').fillColor('#555').text('support@makemybrand.live', { align: 'left' });
    doc.moveDown(0.5);

    doc.fontSize(18).fillColor('#000').font('Helvetica-Bold').text('INVOICE', { align: 'right' });
    doc.fontSize(10).font('Helvetica').fillColor('#555');
    doc.text(`Invoice No: ${order.invoice_id}`, { align: 'right' });
    doc.text(`Date: ${invoiceDate}`, { align: 'right' });
    doc.moveDown(1.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);

    // Bill To
    doc.fontSize(11).fillColor('#000').font('Helvetica-Bold').text('Bill To:');
    doc.font('Helvetica').fillColor('#333');
    doc.text(user.name);
    doc.text(user.email);
    doc.moveDown(1.5);

    // Table header
    const tableTop = doc.y;
    doc.fillColor('#f0f0f0').rect(50, tableTop, 500, 22).fill();
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(10);
    doc.text('Description', 55, tableTop + 6, { width: 250 });
    doc.text('Qty', 305, tableTop + 6, { width: 60, align: 'center' });
    doc.text('Unit Price', 365, tableTop + 6, { width: 90, align: 'right' });
    doc.text('Amount', 455, tableTop + 6, { width: 90, align: 'right' });

    // Table row
    const rowTop = tableTop + 28;
    doc.font('Helvetica').fillColor('#333').fontSize(10);
    doc.text(`${plan.name} (${plan.duration_unit})`, 55, rowTop, { width: 250 });
    doc.text(String(order.quantity), 305, rowTop, { width: 60, align: 'center' });
    doc.text(`INR ${parseFloat(order.price).toFixed(2)}`, 365, rowTop, { width: 90, align: 'right' });
    doc.text(`INR ${parseFloat(order.price).toFixed(2)}`, 455, rowTop, { width: 90, align: 'right' });

    doc.moveDown(3.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(0.5);

    // Totals
    const totalsX = 365;
    doc.font('Helvetica').fillColor('#333').fontSize(10);
    doc.text('Subtotal:', totalsX, doc.y, { width: 90 });
    doc.text(`INR ${parseFloat(order.price).toFixed(2)}`, 455, doc.y - doc.currentLineHeight(), { width: 90, align: 'right' });
    doc.moveDown(0.5);
    doc.text('GST (18%):', totalsX, doc.y, { width: 90 });
    doc.text(`INR ${parseFloat(order.gst).toFixed(2)}`, 455, doc.y - doc.currentLineHeight(), { width: 90, align: 'right' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillColor('#000');
    doc.text('Total:', totalsX, doc.y, { width: 90 });
    doc.text(`INR ${parseFloat(order.amount).toFixed(2)}`, 455, doc.y - doc.currentLineHeight(), { width: 90, align: 'right' });

    doc.moveDown(2);

    // Subscription period
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(0.5);
    doc.font('Helvetica').fillColor('#555').fontSize(10);
    doc.text(`Subscription Period: ${startDate}  →  ${endDate}`);

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#aaa').text('Thank you for subscribing to MakeMyBrand!', { align: 'center' });

    doc.end();
  });
}

module.exports = { generateInvoicePdf };
