import PDFDocument from 'pdfkit';
import fs from 'fs';

function createPDF(data, outputPath = 'utils/mailUtils/output.pdf') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
    
        // Pipe the PDF to a file stream for writing
        doc.pipe(fs.createWriteStream(outputPath));

        console.log('Creating PDF...');
    
        // Set PDF document properties (optional)
        // doc.info({
        //   Title: 'Diet-Chart',
        //   Author: 'TattvaShanti - Nutrition',
        //   Subject: 'Diet Chart for the next week',
        //   Keywords: 'Diet, Nutrition, Health',
        // });
    
        // Add content to the PDF
        doc.fontSize(12);
        doc.text('This is a sample PDF document.', 50, 50);
    
        // Example of adding an image (replace with your image path)
        // doc.image('path/to/your/image.jpg', 100, 100, { width: 100 });
    
        // Add more content as needed using PDFKit's methods
        const data = [
            ['Column1', 'Column2', 'Column3'],
            ['Row1 Col1', 'Row1 Col2', 'Row1 Col3'],
            ['Row2 Col1', 'Row2 Col2', 'Row2 Col3']
        ];
        createTable(doc, data, 50, 100, 300, 100);

        console.log('PDF created successfully');
    
        // End the PDF document
        doc.end();
        resolve('PDF created successfully');
    
        doc.on('error', (err) => {
          reject(err);
        });
    });
}

function createTable(doc, data, x, y, width, height) {
    // Calculate column widths based on data and total width
    const columnWidths = data[0].map(col => width / data[0].length);
  
    // Calculate row height based on number of rows and total height
    const rowHeight = height / data.length;

    console.log('Creating table...');
  
    // Draw table header
    data[0].forEach((header, index) => {
      doc.rect(x + index * columnWidths[index], y, columnWidths[index], rowHeight).stroke();
      doc.text(header, x + index * columnWidths[index] + 5, y + 5);
    });
  
    // Draw table rows
    for (let i = 1; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        doc.rect(x + j * columnWidths[j], y + i * rowHeight, columnWidths[j], rowHeight).stroke();
        doc.text(data[i][j], x + j * columnWidths[j] + 5, y + i * rowHeight + 5);
      }
    }
}

export default createPDF;