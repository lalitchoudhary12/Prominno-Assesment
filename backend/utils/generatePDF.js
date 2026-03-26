const PDFDocument = require("pdfkit");
const fs = require('fs');
const request = require('sync-request');

module.exports = (product, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");

  doc.text(`Product: ${product.productName}`);
  doc.text(`Description: ${product.productDescription}`);

  let total = 0;

product.brands.forEach(b => {
    doc.fontSize(12).text(`${b.brandName} - Rs.${b.price}`);
    total += b.price;

    if (Buffer.isBuffer(b.image)) {
        try {
            doc.image(b.image, { fit: [150, 150] });
        } catch (e) {
            doc.text('Image not provided');
        }
    } else if (typeof b.image === 'string') {
        if (b.image.startsWith('data:image/')) {
            try {
                const base64 = b.image.split(',')[1];
                const imgBuf = Buffer.from(base64, 'base64');
                doc.image(imgBuf, { fit: [150, 150] });
            } catch (e) {
                doc.text('Image not provided');
            }
        } else if (b.image.startsWith('http://') || b.image.startsWith('https://')) {
            try {
                const resp = request('GET', b.image, { headers: { 'User-Agent': 'Node' } });
                if (resp.statusCode === 200) {
                    const imgBuf = resp.getBody();
                    try {
                        doc.image(imgBuf, { fit: [150, 150] });
                    } catch (e) {
                        doc.text('Image not provided (invalid image data)');
                    }
                } else {
                    doc.text('Image not provided (remote image not reachable)');
                }
            } catch (e) {
                doc.text('Image not provided (failed to fetch remote image)');
            }
        } else if (fs.existsSync(b.image)) {
            try {
                doc.image(b.image, { fit: [150, 150] });
            } catch (e) {
                doc.text('Image not provided');
            }
        } else {
            doc.text('Image not provided');
        }
    } else {
        doc.text('Image not provided');
    }

    doc.moveDown();
});

  doc.text(`Total: Rs.${total}`);

  doc.pipe(res);
  doc.end();
};