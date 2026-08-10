import nodemailer from "nodemailer";

const transporter =
nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD }
});


//send Reset Email
export const sendResetEmail = async (
  to: string,
  token: string
) => {
  const resetLink = `https://smart-syndic-h46p.vercel.app/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to,

    subject: "Password Reset",

    text: `
Hello,
You requested to reset your password.
Click the link below:
 ${resetLink}

If you did not request this, ignore this email. `, 
  }  ) ;                                                  };


  //send infos to owner after creating account by syndic

export const sendOwnerCredentials = async (

  to: string,
  email: string,
  tempPassword: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
     subject: "Welcome to Our Residence",
      
html: 
`<div style="
    font-family: Arial, Helvetica, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f8f9fa;
    padding: 30px;
    color: #333;
  ">    <div style="  background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

      <h2 style="        color: #FF0014;
        text-align: center;
        margin-bottom: 25px;">

        Welcome to Our Platform
      </h2>

      <p>Hello,</p>

      <p>
        Your account has been successfully created.
        You can use the credentials below to access your account.
      </p>

      <div style="
        background-color: #f1f5f9;
        padding: 20px;
        border-radius: 8px;
        margin: 25px 0;
      ">
        <p style="margin: 8px 0;">
          <strong>Email:</strong><br>
          ${email}
        </p>

        <p style="margin: 8px 0;">
          <strong>Temporary Password:</strong><br>
          ${tempPassword}
        </p>
      </div>

      <p>
        For security reasons, please change your password after your first login.
      </p>

      <p>
        If you have any questions, please contact our support team.      </p>

      <hr style="
        border: none;
        border-top: 1px solid #ddd;
        margin: 30px 0;">
      <p style="
        font-size: 13px;
        color: #777;
        text-align: center;">
        © ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
</div></div>`,       });
    console.log(info);

  } catch (err) {
    console.error("EMAIL ERROR:");
    console.error(err);
  }
};

// ======================================
// Reservation Confirmation Email
// ======================================
export const sendReservationConfirmation = async (
  to: string,
  data: {
    visitor_name: string;
    appointment_date: Date | string;
    time_slot: string;
    apartment_name: string;
  }

) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Reservation Confirmation",

    html: `

      <h2>Reservation Confirmed</h2>

      <p>Hello ${data.visitor_name}</p>

      <p>
      Your visit has been scheduled.
      </p>
      <ul>

        <li>
        Apartment:
        ${data.apartment_name}
        </li>
        <li>
        Date:
        ${data.appointment_date}
        </li>
        <li>
        Time:
        ${data.time_slot}
        </li>

      </ul>

      <p>
      Thank you.
      </p>     `
                                         });};