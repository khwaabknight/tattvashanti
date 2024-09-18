export const contactUsEmail = (
    name,
    startDate,
    endDate,
  ) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://tattvashanti.vercel.app"><img class="logo"
                    src="https://storage.googleapis.com/tattvashanti-assets/tattva-shanti-logo-square-light.jpg" alt="TattvaShanti Logo"></a>
            <div class="message">Diet Chart Email</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>I hope you're doing great! As per our discussion, I’ve created a customized diet chart designed to suit your specific goals and requirements.</p>
                <p>Please find your personalized plan attached, tailored to meet your needs and preferences.</p>
            </div>
            <div class="support">If you have any further questions or need immediate assistance, please feel free to reach
                out to us at <a href="mailto:info@proindia.net">info@proindia.net</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`
  }