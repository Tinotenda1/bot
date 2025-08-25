// menus.js
import axios from "axios";
import {setMessageState} from '../userStateManager.js';

import {markAsRead} from'./markAsRead.js';
import {sendOneMessageButtonFunction, sendTwoMessageButtonFunction, sendThreeMessageButtonFunction} from './sendButtons.js';

async function sendHomeMenu(businessPhoneNumberId, user, messageId) {
  const text = "Welcome to ARDA Seeds' Digital Reception 🌱";
  const label1 = "Seed Grower";
  const label2 = "Buyer";
  const label3 = "other";
  const buttonId1 = "grower";
  const buttonId2 = "buyer";
  const buttonId3 = "other";
  
  await markAsRead(businessPhoneNumberId, messageId);
  await sendThreeMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, label3, buttonId1, buttonId2, buttonId3);
}

async function invalidHomeMenuInputFunction(businessPhoneNumberId, user, messageId, text) {
  
  const label1 = "Seed Grower";
  const label2 = "Buyer";
  const label3 = "other";
  const buttonId1 = "grower";
  const buttonId2 = "buyer";
  const buttonId3 = "other";
  
  await markAsRead(businessPhoneNumberId, messageId);
  await sendThreeMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, label3, buttonId1, buttonId2, buttonId3);
}

export { sendHomeMenu, invalidHomeMenuInputFunction };
