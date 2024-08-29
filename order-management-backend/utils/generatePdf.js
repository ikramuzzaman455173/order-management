const PDFDocument = require('pdfkit');

const generatePdf = (orders) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Add some content to the PDF
      doc.fontSize(16).text('Order Report', { align: 'center' });
      doc.moveDown();

      orders.forEach(order => {
        doc.fontSize(12).text(`Name: ${order.name}`);
        doc.text(`Date: ${order.date.toDateString()}`);
        doc.text(`Status: ${order.status}`);
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generatePdf;
