const nodemailer= require("nodemailer")

const sendEmail = async options =>{
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6cbb81bf3e1090",
          pass: "cabfcf99ac7abf"
        }
      });
    const mensaje={
        from: "Sebastiano Bake Shop <noreply@sbs.com>",
        to: options.email,
        subject: options.subject,
        text: options.mensaje
    }

    await transport.sendMail(mensaje)
}

module.exports= sendEmail;