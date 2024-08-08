import path,{ dirname } from "path";
import mailSender from "./mailSender.js";

import { fileURLToPath } from 'url';


async function sendDietChartMail(email, name) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const title = "Diet Chart";
    const body = `
    <h1>Hello ${name},</h1>
    <p>Here is your diet chart for the next week:</p>
    
    <p>Thank you for using our service.</p>
    `;
    const attachments = {
        filename: "diet-chart.pdf",
        path: path.join(path.resolve(__dirname), "output.pdf"),
    };
    const mailResponse = await mailSender(email, title, body, attachments);
    return mailResponse;
}

export default sendDietChartMail;