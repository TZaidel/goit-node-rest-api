import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const { MAIL_PASSWORD } = process.env

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: "randomnessrandom@meta.ua",
    pass: MAIL_PASSWORD,
  }
}

const transport = nodemailer.createTransport(nodemailerConfig)

export const sendMail = async data => {
  const email = { ...data, from: "randomnessrandom@meta.ua" }
  try {
    await transport.sendMail(email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
  }