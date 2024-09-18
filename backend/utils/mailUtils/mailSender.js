import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email,title,body,attachments) => {
    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    let info = await transporter.sendMail({
        from:"TattvaShanti - Nutrition",
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`,
        attachments:[
            {
                filename:attachments.filename,
                path:attachments.path,
            }
        ]
    });
    return info;
}

export default mailSender;