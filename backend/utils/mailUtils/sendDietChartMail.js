import { dirname } from "path";
import mailSender from "./mailSender.js";

import { fileURLToPath } from 'url';
import { contactUsEmail } from "./templates/dietChartEmail.js";


async function sendDietChartMail(email, name, startDate, endDate) {
    const title = "Diet Chart";
    const body = contactUsEmail(name, startDate, endDate);
    const attachments = {
        filename: "diet-chart.pdf",
        path: process.env.NODE_ENV === 'production' ? "/tmp/output.pdf" : "tmp/output.pdf",
    };
    const mailResponse = await mailSender(email, title, body, attachments);
    return mailResponse;
}

export default sendDietChartMail;