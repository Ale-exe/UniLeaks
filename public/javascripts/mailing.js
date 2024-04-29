const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: 'hotmail',
	auth:{
		user: process.env.USER,
		pass: process.env.PASS

	}
})

const verifyEmail = (req, res) => {
	if(req.session.code === req.body.code){

	}
}

const sendVerificationEmail = (req, res) => {

    async function send() {
        // user entered email address
        let username = req.body.username;
        let emailAddress = req.body.email;

       const generateDigits = (numDigits) => {
              const dict = "0123456789";
              var digits = "";
              for(var i = 0; i < numDigits; i++){
                  digits += dict[Math.floor(Math.random() * (dict.length))];
              }
              return digits;
              
          }

        const code = generateDigits(4);
        req.session.code = code;

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'UniLeaks <unileaks@hotmail.com>',
            to: emailAddress,
            subject: "UniLeaks Sign Up Verification",
            html: `<p>Hi ${username}, <br> <br> This is your 4 digit code: ${code}.<br><br>Please enter this verification code back on the register page.</p>`,
        })
        console.log("Message sent: %s", info);
}
// return error message to user if no response from email
    send()
        .then((data) => {
            res.status(201).send({status:201});
        })
        .catch((error) => {
            console.error(error);
            res.status(201).send({status:201});
        });
}

module.exports = {
	sendVerificationEmail
}