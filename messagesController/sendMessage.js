// messagesController/sendMessage.js

import axios from "axios";

async function sendMessageFunction(businessPhoneNumberId, user, messageId, messageData) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: user,
        text: { body: messageData },
        context: {
          message_id: messageId,
        },
      },
    });
  } catch (error) {
    console.error("Error sending other messages:", error.message);
  }
}

export {sendMessageFunction};
