import nodemailer from 'nodemailer';
import {
  initializeUserState,
  userStatesMap,
  setMessageState,
  setMessage,
  setUserName,
  resetUserData
} from '../userStateManager.js';
import {sendMessageFunction} from '../messagesController/sendMessage.js';


// configure your transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tinotenda.kamunda1993@gmail.com',
    pass: 'owswdhexqiewnios' // use App Password if using Gmail with 2FA
  }
});

/**
 * Send an email with user's WhatsApp message to admin
 * @param {string} userName - User's Name (e.g., Tinotenda Kamunda)
 * @param {string} user - User's phone number (e.g., +26377xxxxxxx)
 * @param {string} userMessage - The message content from user
 */
export async function sendEmailToAdmin(businessPhoneNumberId, user, messageId, text) {
    const userState = userStatesMap.get(user);
  try {
    const info = await transporter.sendMail({
      from: '"ARDA SEEDS Chatbot" <your@gmail.com>',
      to: 'tinotenda.kamunda@arda.co.zw', // change to your admin email
      subject: 'New Request from WhatsApp Chatbot',
      text: `Name: ${userState.userName}\n📞 Phone: ${user}\n\n✉️ Message:\n${userState.message}`
    });

    sendMessageFunction(businessPhoneNumberId, user, messageId, text);

    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}
