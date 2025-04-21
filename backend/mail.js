const nodemailer = require('nodemailer');
require('dotenv').config();

class Email {
    static _instance;

    static get instance() {
        if (!this._instance) {
            this._instance = new Email();
        }
        return this._instance;
    }

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async enviarEmail(email, passwordNew) {
        const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        background-color: #fff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #007bff;
                    }
                    p {
                        font-size: 16px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #007bff;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 5px;
                        text-decoration: none;
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Recuperación de Contraseña</h1>
                    <p>Hola,</p>
                    <p>Hemos recibido una solicitud para recuperar tu contraseña.</p>
                    <p><strong>Tu nueva contraseña temporal es:</strong></p>
                    <h2 style="color: #007bff;">${passwordNew}</h2>
                    <h3>Te pedimos por favor que al ingresar a la plataforma cambies tu contraseña.</h3>
                    <p>¡Sigue aprendiendo!</p>
                    <a href="#" class="button">Ir al sitio</a>
                </div>
                <div class="footer">
                    <p>AsesoraTEC</p>
                </div>
            </body>
        </html>
    `
        return await this.transporter.sendMail({
            from: `"Recuperación de contraseña" <'al22760571@ite.edu.mx'>`,
            to: email,
            subject: 'Recuperación de contraseña',
            html: htmlContent
        });
    }
}

module.exports = Email.instance;