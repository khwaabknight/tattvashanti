import PDFKit from 'pdfkit';
import {PDFDocument as PDFLibDocument} from 'pdf-lib';
import fs from 'fs';
import convertArrayToStructuredDietChart from '../convertItemsArrayToStructuresDietCharts.js';
import path from 'path';
import { fileURLToPath } from 'url';

const rowHeights=[0,86,172,266,352,439,525];

const colWidth =142;

async function createDietChartPDF(dietChart) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '../../public/static/Your-Diet-Chart-1.pdf');
    const templateBytes = fs.readFileSync(filePath);
    const templatePdfDoc = await PDFLibDocument.load(templateBytes);

    const pdfKitDoc = new PDFKit({size: 'A3', margin:0, layout: 'landscape'});
    pdfKitDoc.font('Times-Bold')

    pdfKitDoc.fontSize(20)
    pdfKitDoc.fillColor('#333');
    pdfKitDoc.text(dietChart.user.name, 850, 20, { align: 'right', width: 300  });

    const start =new Date(dietChart.startDate);
    const end = new Date(dietChart.endDate);
    const dateRange = start.getUTCDate() + " " + start.toLocaleString('default', { month: 'long' }) + " " + start.getUTCFullYear() + " - " + end.getUTCDate() + " " + end.toLocaleString('default', { month: 'long' }) + " " + end.getUTCFullYear();
    pdfKitDoc.text( dateRange, 850, 40, { align: 'right', width: 300  });

    pdfKitDoc.fontSize(10)
    pdfKitDoc.fillColor('#000');

    let outputPath = 'tmp/output.pdf';
    if(process.env.NODE_ENV === 'production') {
      outputPath = '/tmp/output.pdf';
    }
    
    const structuredDietChart = convertArrayToStructuredDietChart(dietChart.items);
    structuredDietChart.forEach((element,index) => {
      element.meals.forEach((meal, mealIndex) => {
        let yCoordinate = 200 + rowHeights[index];
        if(meal.dishes.length === 0) {
          pdfKitDoc.text("------", 170 + mealIndex * colWidth + 60, yCoordinate+ 40);
          return;
        }else {
          meal.dishes.forEach((dish) => {
            if(dish?.dish?.name?.length > 29){
              pdfKitDoc.text(dish?.dish?.name.substring(0, 29) + "-", 170 + mealIndex * colWidth + 1, yCoordinate);
              pdfKitDoc.text(dish?.dish?.name.substring(29), 170 + mealIndex * colWidth + 1, yCoordinate + 9);
              yCoordinate += 18;
            }else{
              pdfKitDoc.text(dish?.dish?.name, 170 + mealIndex * colWidth + 1, yCoordinate);
              yCoordinate += 9;
            }
            pdfKitDoc.text(dish.quantity+dish.unitOfMeasurement+"("+dish.grams+"grams)", 170 + mealIndex * colWidth + 1, yCoordinate);
            yCoordinate += 14;
          });
        }
      });
    });


    const overlayPdfBytes = await new Promise((resolve, _) => {
      const chunks = [];
      pdfKitDoc.on('data', chunks.push.bind(chunks));
      pdfKitDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfKitDoc.end();
    });
  
    // Load the overlay content into pdf-lib
    const overlayPdfDoc = await PDFLibDocument.load(overlayPdfBytes);
  
    // Copy overlay pages into the template PDF
    const [overlayPage] = await templatePdfDoc.copyPages(overlayPdfDoc, [0]);
  
    // Embed the overlay page into the template
    const embeddedPage = await templatePdfDoc.embedPage(overlayPage);
  
    // Draw the embedded overlay page on the first page of the template
    const firstPage = templatePdfDoc.getPages()[0];
    firstPage.drawPage(embeddedPage);
  
    // Save the modified PDF
    const modifiedPdfBytes = await templatePdfDoc.save();
    fs.writeFileSync(outputPath, modifiedPdfBytes);
    
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw new Error(error);
  }
}

export default createDietChartPDF;