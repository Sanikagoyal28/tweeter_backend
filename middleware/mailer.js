
const nodemailer = require("nodemailer")

const sendMail = async(email, otp) =>{

    const msg = {
        from:"sanikagoyal9@gmail.com",
        to:email, 
        subject:`${otp} is your Otp from Tweeter`,
        html:`
        <div class="otpDiv" style=" width:80%; margin:auto; padding:10px">
            <h2 class="otpHead" style="color:#5C3F76;">Team Tweeter</h2>
            <h3 style="margin-bottom:10px;">Thankyou for using Tweeter</h3>
            <p style="margin-bottom:20px;">A password reset event has been triggered. To complete the password reset process, use the following OTP,</p>
            <h1><b style="margin-bottom:20px; color:#5C3F76; font-size=30px;">${otp}</b></h1>
            <p>Otp is valid for 2 minutes. So, make sure to enter the otp within time or you will need to make a new request</p>
        </div>
        `,
    }

    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        service:"gmail",
        port:535,
        auth:{
            user:process.env.USERID,
            pass:process.env.PASSWORD
        }
    })

    transporter.sendMail(msg, (err)=>{
        if(err){
            console.log(err)
            return false;
        }
        else{
            console.log("msg sent successfully")
            return true;
        }
    })
}

module.exports ={
    sendMail
}