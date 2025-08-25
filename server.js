import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import connection from "./db.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import {markAsRead} from './messagesController/markAsRead.js';
import {sendTractorServicesOptions, sendSoilTestingPaymentOptions, sendMenu, sendJvCrops, sendPaymentOptions, sendFarmingTipsCategories, sendTipsCategories, sendTipsStages} from './messagesController/interactiveLists.js';
import {sendMessageFunction} from './messagesController/sendMessage.js';
import {sendTwoMessageButtonFunction} from './messagesController/sendButtons.js'
import './appUtils/dailyTasks.js';
import {sendEmailToAdmin} from './appUtils/emailer.js';
import {
  initializeUserState,
  userStatesMap,
  setMessageState,
  setModuleName,
  setTipCategory,
  setTipSubCategory,
  setTipStage,
  setAirtimePhone,
  setPaymentPhone,
  setPackage,
  setCurrency, 
  setAmount,
  setJvCrop,
  setFarmName,
  setHectares,
  setHectaresToRegister,
  setMessage,
  setUserName,
  resetUserData
} from './userStateManager.js';
dotenv.config();


// Function to ping the Glitch app and keep it awake
function keepAppAlive() {
  setInterval(() => {
    axios.get('https://c2d01b48051a.ngrok-free.app')  // Replace with your Glitch project URL
      .then((response) => {
        console.log('Pinged successfully', response.status);
      })
      .catch((error) => {
        console.error('Error pinging app:', error);
      });
  }, 3 * 60 * 1000); // Ping every 5 minutes
}

//keepAppAlive();



// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, 'temp');
const ensureTempDir = async () => { try { await fs.mkdir(TEMP_DIR, { recursive: true }); } catch {} };


dotenv.config();

const app = express();
app.use(express.json());


const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, integrationId, integrationKey, USD_integrationId, USD_integrationKey, GITHUB_TOKEN, MY_PHONE_NUMBER_ID} = process.env;

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: GITHUB_TOKEN,
});


app.post("/webhook", async (req, res) => {
  //console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  
  const user = req.body.entry?.[0].changes?.[0].value?.messages?.[0]?.from;
  
  if(user && req.body.entry[0].changes[0].value.metadata.phone_number_id === MY_PHONE_NUMBER_ID){
   const message = req.body.entry?.[0].changes?.[0].value?.messages?.[0];
   const businessPhoneNumberId = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
   const messageType = message?.type;
   const buttonReplyId = message?.interactive?.button_reply?.id;
   const optionReplyId = message?.interactive?.list_reply?.id;
   const messageId = message?.id;
  initializeUserState(user);
  const userState = userStatesMap.get(user); // Access a specific user's state
  let messageState;

  

  
  if (!userStatesMap.get(user)?.messageState) {
    resetUserData(user);
            await markAsRead(businessPhoneNumberId, messageId);
            await sendMenu(businessPhoneNumberId, user);
            messageState = "home";
    setMessageState(user, messageState);
    
  } else {
    
    switch (userStatesMap.get(user)?.messageState) {
      case "home":
        if (optionReplyId === "farming_tips"){
          setModuleName(user, "Farming Tips");
            await markAsRead(businessPhoneNumberId, messageId);
            await sendFarmingTipsCategories(businessPhoneNumberId, user);
            messageState = "farming_tips"; 
          setMessageState(user, messageState);
          
        }else if(optionReplyId === "micro_credit"){
          setModuleName(user, "Micro Credit");
          const text = "You are currently not eligible for a Micro Credit. \nKeep using ARDA V-30 Farmer Digital Assistant or *887# services regularly to become eligible in the future. \n\nType 'Menu' for main menu";
            await markAsRead(businessPhoneNumberId, messageId);
            //await manageMicroCredit(businessPhoneNumberId, user);
            await sendMessageFunction(businessPhoneNumberId, user, messageId, text)
            messageState = "home"; 
          setMessageState(user, messageState);
                  
        }else if(optionReplyId === "farming_news"){
          setModuleName(user, "Farming News");
            await markAsRead(businessPhoneNumberId, messageId);
            await sendPaymentOptions(businessPhoneNumberId, user);
            messageState = "ask_for_amount"; 
          setMessageState(user, messageState);

        }else if(optionReplyId === "joint_venture"){
          setModuleName(user, "Joint Venture");
            await markAsRead(businessPhoneNumberId, messageId);
            await sendJvCrops(businessPhoneNumberId, user);
            messageState = "joint_venture"; 
          setMessageState(user, messageState);

        }else if(optionReplyId === "airtime"){
          setModuleName(user, "Airtime");
          const text = "Enter NetOne number you would like to purchase Airtime for in the format *071XXXXXXX starting with 0*. \n\nType 'Menu' for Main Menu."
            setCurrency(user, buttonReplyId)
            await markAsRead(businessPhoneNumberId, messageId);
            await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
            messageState = "ask_for_airtime_phone";
          setMessageState(user, messageState);
          
        }else if(optionReplyId === "soil_testing"){
          setModuleName(user, "Soil Testing");
            await markAsRead(businessPhoneNumberId, messageId);
            await sendSoilTestingPaymentOptions(businessPhoneNumberId, user);
            messageState = "confirmation"; 
          setMessageState(user, messageState);
          
        }else if(optionReplyId === "tractor_services"){
          setModuleName(user, "Tractor Services & Combine Harvesting");
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTractorServicesOptions(businessPhoneNumberId, user);
            messageState = "confirmation"; 
          setMessageState(user, messageState);
          
        }else if(optionReplyId === "harvesting_services"){
          setModuleName(user, "Combine Harvesting Services");
            await markAsRead(businessPhoneNumberId, messageId);
            await manageHarvestingServices(businessPhoneNumberId, user);
            messageState = "harvesting_services"; 
          setMessageState(user, messageState);
          
        }else if(optionReplyId === "help"){
          setModuleName(user, "Help");
            const messageData = "Please type your message below. \n\nType 'Menu' to go back to main menu.";
          await markAsRead(businessPhoneNumberId, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, messageData);
          messageState = "custom_enquiry";
          setMessageState(user, messageState);
          
        }else{
            await markAsRead(businessPhoneNumberId, messageId);
            await sendMenu(businessPhoneNumberId, user);
            messageState = "home";
          setMessageState(user, messageState);

        }
        console.log(`Current Message State for ${user} => ${userStatesMap.get(user)?.messageState}`);
      break; 

      case "send_message":
          if(buttonReplyId === "confirm"){
          const text = "Your message has been forwarded to our Customer Experience representatives. Thank you for reaching out to us, our team will get back to you. \n\nType 'Menu' for Main Menu.";
            
          await markAsRead(businessPhoneNumberId, messageId);
          await sendEmailToAdmin(businessPhoneNumberId, user, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);

          
          messageState = "home";
          setMessageState(user, messageState);
          
          }else{
            await markAsRead(businessPhoneNumberId, messageId);
            await sendMenu(businessPhoneNumberId, user);
            messageState = "home";
          setMessageState(user, messageState);

        }

      break;

      case "user_name":
          if(message?.text?.body?.trim().toLowerCase() !== "menu"){
            setUserName(user, message?.text?.body);
            const text = "Your message is about to be forwarded to our Customer Experience representatives. \n\nPlease note that your message is important to us and it will be recorded to help us assist you better. \n\nKindly confirm to send in your message. ";
            const label1 = "Confirm";
            const label2 = "Cancel";
            const buttonId1 = "confirm";
            const buttonId2 = "cancel";
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTwoMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, buttonId1, buttonId2);    
            messageState = "send_message";
            setMessageState(user, messageState);
          }
      break;

      case "custom_enquiry":
        if(message?.text?.body?.trim().toLowerCase() !== "menu"){
              const messageText = message?.text?.body;
              const messageData = "Kindly tell us your Name. (This will help us get back to you quicker). \n\nType 'Menu' to go back to Main Menu.";
          
          setMessage(user, messageText);
          await markAsRead(businessPhoneNumberId, messageId);
          sendMessageFunction(businessPhoneNumberId, user, messageId, messageData)

          messageState = "user_name";
          setMessageState(user, messageState);
          
          }
        else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "farming_tips":
        if(optionReplyId){
          if(optionReplyId === "livestock"){
          setTipCategory(user, "Livestock");
        }else if(optionReplyId === "cereal_crops"){
          setTipCategory(user, "Cereal Crops");
        }else{
          setTipCategory(user, "Horticulture");
        }
        await markAsRead(businessPhoneNumberId, messageId);
        await sendTipsCategories(businessPhoneNumberId, user);
        messageState = "categories";
        setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "categories":
        if(optionReplyId){
          const name = optionReplyId.charAt(0).toUpperCase() + optionReplyId.slice(1);
          setTipSubCategory(user, name)
          await markAsRead(businessPhoneNumberId, messageId);
          await sendTipsStages(businessPhoneNumberId, user);
          messageState = "stages";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "stages":
        if(optionReplyId){
          const stage = optionReplyId.charAt(0).toUpperCase() + optionReplyId.slice(1);
          setTipStage(user, stage)
          await markAsRead(businessPhoneNumberId, messageId);
          await sendPaymentOptions(businessPhoneNumberId, user);
          messageState = "ask_for_amount";
          setMessageState(user, messageState);
       }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "currency":
        if(buttonReplyId){
          const text = "Please select your preferred Airtime currency. \n\nType 'Menu' to go back to Main Menu. "
          const label1 = "USD";
          const label2 = "ZWL";
          const buttonId1 = "usd";
          const buttonId2 = "zwl";
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTwoMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, buttonId1, buttonId2);
            messageState = "currency"; 
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "ask_for_airtime_phone":
        if(/^07\d{8}$/.test(message?.text?.body)){
          const airtimePhone = message?.text?.body;
          setAirtimePhone(user, airtimePhone);
          const text = "Enter the *USD* Airtime Amount you would like to purchase. \n\nType 'Menu' for Main Menu."
          await markAsRead(businessPhoneNumberId, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "ask_for_amount";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "ask_for_amount":
        if(/^\d+(\.\d{1,2})?$/.test(message?.text?.body) || optionReplyId){
          let amount;
          if(optionReplyId === "daily"){
            amount = 0.10;
            setPackage(user, "Daily");
          }else if(optionReplyId === "weekly"){
            amount = 0.50;
            setPackage(user, "Weekly");
          }else if(optionReplyId === "monthly"){
            amount = 0.90;
            setPackage(user, "Monthly");
          }else if(userState.moduleName === "Joint Venture"){
            amount = 30.00;
            setPackage(user, "Joint Venture");
          }else{
            amount = message?.text?.body;
          }
          setAmount(user, amount);
          const text = "Enter your OneMoney number for payment in the format *071XXXXXXX starting with 0*. \n\nType 'Menu' for Main Menu."
          await markAsRead(businessPhoneNumberId, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "confirmation";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "confirmation":
        if(/^07\d{8}$/.test(message?.text?.body) && userState.moduleName !== optionReplyId){
          const paymentPhone = message?.text?.body;
          setPaymentPhone(user, paymentPhone);
          let text;
          if(userState.moduleName === "Airtime"){
            text = "Confirm you are about to purchase *USD "+userState.amount+"* Airtime for mobile number *"+userState.airtimePhone+"*? ";
          }else if(userState.moduleName === "Farming Tips"){
            text = "Confirm you are about to make payment for *"+userState.tipSubCategory+" "+userState.tipStage+" "+userState.package+" "+userState.moduleName+"*. "
          }else if(userState.moduleName === "Farming News"){
            text = "Confirm you are about to subscribe for *"+userState.package+" "+userState.moduleName+"*. "
          }
          const label1 = "Yes";
          const label2 = "No";
          const buttonId1 = "yes";
          const buttonId2 = "no";
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTwoMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, buttonId1, buttonId2);
            messageState = "payment";
          setMessageState(user, messageState);

        }else if(userState.moduleName === "Soil Testing" || userState.moduleName === "Tractor Services & Combine Harvesting" ){
          let amount;
          if(optionReplyId === "daily" && userState.moduleName === "Soil Testing"){
            amount = 10;
            setPackage(user, "pH Only");
          }else if(optionReplyId === "weekly" && userState.moduleName === "Soil Testing"){
            amount = 15;
            setPackage(user, "Full Analysis");
          }else if(optionReplyId === "monthly" && userState.moduleName === "Soil Testing"){
            amount = 20;
            setPackage(user, "Full Analysis + Recommendations");
          }else if(optionReplyId === "daily" && userState.moduleName === "Tractor Services & Combine Harvesting"){
            amount = 75;
            setPackage(user, "Ploughing");
          }else if(optionReplyId === "weekly" && userState.moduleName === "Tractor Services & Combine Harvesting"){
            amount = 65;
            setPackage(user, "Discing");
          }else if(optionReplyId === "monthly" && userState.moduleName === "Tractor Services & Combine Harvesting"){
            amount = 50;
            setPackage(user, "Planting");
          }else if(optionReplyId === "weekly1" && userState.moduleName === "Tractor Services & Combine Harvesting"){
            amount = 35;
            setPackage(user, "Spraying");
          }else if(optionReplyId === "monthly1" && userState.moduleName === "Tractor Services & Combine Harvesting"){
            amount = 35;
            setPackage(user, "Combine Harvesting");
          }
          
          const text = "Confirm you are requesting *"+userState.moduleName+" "+userState.package+" USD"+amount+"*. "
          const label1 = "Yes";
          const label2 = "No";
          const buttonId1 = "yes";
          const buttonId2 = "no";
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTwoMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, buttonId1, buttonId2);
            messageState = "payment";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "joint_venture":
        if(optionReplyId){
          setModuleName(user, "Joint Venture");
          setJvCrop(user, optionReplyId)
          const text = "Please provide the *name of your farm*. \n\nType 'menu' for Main Menu.";
          await markAsRead(businessPhoneNumberId, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "ask_farm_name";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "ask_farm_name":
        if(message?.text?.body?.trim().toLowerCase() !== "menu"){
          setFarmName(user, message?.text?.body);
          const text = "How many hectares do you have under irrigation? \n\nType 'menu' for Main Menu.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "ask_hectares";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "ask_hectares":
        if(/^\d+(\.\d{1,2})?$/.test(message?.text?.body)){
          setHectares(user, message?.text?.body);
          const text = "How many hectares do you want to register? \n\nType 'menu' for Main Menu.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "ask_hacters_to_register";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "ask_hacters_to_register":
        if(/^\d+(\.\d{1,2})?$/.test(message?.text?.body)){
          setHectaresToRegister(user, message?.text?.body);
          const text = ""+userState.farmName+": "+userState.hectares+" Hectares Irrigable for *"+userState.jvCrop+"* Establishment and *"+userState.hectaresToRegister+" Hectares* for JV Contracting. \nYou will be charged *USD 30.00* for this registration.  \n\nType 'menu' for Main Menu.";
          const label1 = "Yes";
          const label2 = "No";
          const buttonId1 = "yes";
          const buttonId2 = "no";
            await markAsRead(businessPhoneNumberId, messageId);
            await sendTwoMessageButtonFunction(businessPhoneNumberId, user, text, label1, label2, buttonId1, buttonId2);
          messageState = "payment";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Invalid Input please try again.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;

      case "payment":
        if(buttonReplyId === "yes"){
          const text = "Your request is being processed. Ref 2254585215. An agent from ARDA will get in touch.";
          await markAsRead(businessPhoneNumberId, messageId);
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          messageState = "home";
          setMessageState(user, messageState);
        }else{
          await markAsRead(businessPhoneNumberId, messageId);
          const text = "Your request has been cancelled.";
          await sendMessageFunction(businessPhoneNumberId, user, messageId, text);
          await sendMenu(businessPhoneNumberId, user);
          messageState = "home";
          setMessageState(user, messageState);
        }
      break;
      
  }  
  res.sendStatus(200);
  }
  }
});



connection.getConnection()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });


app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here. 
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
