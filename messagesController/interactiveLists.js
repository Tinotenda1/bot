// interactiveLists.js

import axios from "axios";
import {userStatesMap} from '../userStateManager.js';

let rows;

/**
 * Helper to send an interactive list message via WhatsApp Business API
 */
async function sendInteractiveList(businessPhoneNumberId, user, headerText, bodyText, buttonText, rows) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: headerText,
          },
          body: {
            text: bodyText,
          },
          footer: {
            text: "ARDA V-30 Farmer",
          },
          action: {
            button: buttonText,
            sections: [
              {
                title: "Please select",
                rows: rows,
              },
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}

/*********************************JV MENU************************************************/
const jvCrops = [
  { id: "wheat", title: "Wheat", description: "Register for ARDA Wheat Joint Venture Program." },
  { id: "maize", title: "Maize", description: "Register for ARDA Maize Joint Venture Program." },
  { id: "sorghum", title: "Sorghum", description: "Register for ARDA Sorghum Joint Venture Program." },
  { id: "sunflower", title: "Sunflower", description: "Register for ARDA Sunflower Joint Venture Program." },
];

export async function sendJvCrops(businessPhoneNumberId, user) {
  return sendInteractiveList(
    businessPhoneNumberId,
    user,
    "Joint Venture",
    "Please choose Joint Venture Program to register:",
    "Joint Venture",
    jvCrops
  );
}

/********************************FARMING TIPS MENU***************************************/
const farmingTipsCategories = [
  { id: "livestock", title: "Livestock", description: "Livestock Farming Tips" },
  { id: "cereal_crops", title: "Cereal Crops", description: "Cereal Crops Livestock Farming Tips" },
  { id: "horticulture", title: "Horticulture", description: "Horticulture Livestock Farming Tips" },
];

export async function sendFarmingTipsCategories(businessPhoneNumberId, user) {
  return sendInteractiveList(
    businessPhoneNumberId,
    user,
    "Farming Tips",
    "Please choose Farming Tips category:",
    "Farming Tips",
    farmingTipsCategories
  );
}


/******************************************FARMING TIPS MENUS***************************************** */

// Livestock menus
const livestockCategories = [
  { id: "beef", title: "Beef", description: "Farming tips on Beef." },
  { id: "dairy", title: "Dairy", description: "Farming tips on Dairy." },
  { id: "goats", title: "Goats", description: "Farming tips on Goats." },
  { id: "piggery", title: "Piggery", description: "Farming tips on Piggery." },
  { id: "sheep", title: "Sheep", description: "Farming tips on Sheep." },
];


const dairyLivestockStages = [
  { id: "breeding", title: "Breeding", description: "Get tips on Breeding." },
  { id: "fodder_nutrition", title: "Fodder & Nutrition", description: "Get tips on Fodder & Nutrition." },
  { id: "disease_management", title: "Disease Management", description: "Get tips on Disease Management." },
  { id: "milk_handling_hygiene", title: "Milk Handling & Hygiene", description: "Get tips on Milk Handling & Hygiene." },
  { id: "business_development", title: "Business Development", description: "Get tips on Business Development." },
];


const otherLivestockStages = [
  { id: "breeding", title: "Breeding", description: "Get tips on Breeding." },
  { id: "pastures_nutrition", title: "Fodder & Nutrition", description: "Get tips on Fodder & Nutrition." },
  { id: "animal_handling", title: "Disease Management", description: "Get tips on Disease Management." },
  { id: "herd_management", title: "Mislk Handling & Hygiene", description: "Get tips on Milk Handling & Hygiene." },
  { id: "business_development", title: "Business Development", description: "Get tips on Business Development." },
];

//CEREAL CROPS MENUS
const cerealCategories = [
  { id: "maize", title: "Maize", description: "Farming tips on Maize." },
  { id: "sorghum", title: "Sorghum", description: "Farming tips on Sorghum." },
  { id: "wheat", title: "Wheat", description: "Farming tips on Wheat." },
  
];

const cerealStages = [
  { id: "soil_analysis", title: "Soil Analysis", description: "Get tips on Soil Analysis." },
  { id: "planting", title: "Planting", description: "Get tips on Planting." },
  { id: "land_preparation", title: "Land Preparation", description: "Get tips on Land Preparation." },
  { id: "crop_protection", title: "Crop Protection", description: "Get tips on Crop Protection." },
  { id: "harvesting", title: "Harvesting", description: "Get tips on Harvesting." },
];


//HORTICULTURE MENUS
const horticultureCategories = [
  { id: "cabbage", title: "Cabbage", description: "Farming tips on Cabbage" },
  { id: "potato", title: "Potato", description: "Farming tips on Potato" },
  { id: "tomato", title: "Tomato", description: "Farming tips on Tomato" },
  { id: "watermelon", title: "Watermelon", description: "Farming tips on Watermelon" },
  
];

const horticultureStages = [
  { id: "soil_analysis", title: "Soil Analysis", description: "Get tips on Soil Analysis" },
  { id: "planting", title: "Planting", description: "Get tips on Planting." },
  { id: "land_preparation", title: "Land Preparation", description: "Get tips on Land Preparation." },
  { id: "crop_protection", title: "Crop Protection", description: "Get tips on Crop Protection." },
  { id: "harvesting", title: "Harvesting", description: "Get tips on Harvesting." },
];


/********************************FARMING TIPS FUNCTIONS*************************************** */
// Tip categories
export async function sendTipsCategories(businessPhoneNumberId, user) {
  const userState = userStatesMap.get(user);
  if(userState.tipCategory === "Livestock"){
    rows = livestockCategories;
  }else if(userState.tipCategory === "Cereal Crops"){
    rows = cerealCategories;
  }else{
    rows = horticultureCategories;
  }
  return sendInteractiveList(
    businessPhoneNumberId,
    user,
    userState.tipCategory,
    `Please choose ${userState.tipCategory} farming tips category.`,
    userState.tipCategory,
    rows
  );
}

// Tip stages (others)
export async function sendTipsStages(businessPhoneNumberId, user) {
  const userState = userStatesMap.get(user);
  if(userState.tipCategory === "Livestock" && userState.tipSubCategory === "Dairy"){
    rows = dairyLivestockStages;
  }else if(userState.tipCategory === "Livestock" && !userState.tipSubCategory === "Dairy"){
    rows = otherLivestockStages;
  }else if(userState.tipCategory === "Cereal Crops"){
    rows = cerealStages;
  }else{
    rows = horticultureStages;
  }
  return sendInteractiveList(
    businessPhoneNumberId,
    user,
    `${userState.tipSubCategory} Tips`,
    `Please select ${userState.tipSubCategory} farming stage.`,
    userState.tipSubCategory,
    rows
  );
}

/************************************PAYMENTS FUNCTION**************************************** */
export async function sendPaymentOptions(businessPhoneNumberId, user) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Choose Payment Method",
          },
          body: {
            text: "Please select prefered payment method & currency.",
          },
          footer: {
            text: "ARDA V-30 Farmer.",
          },
          action: {
            sections: [
              
              {
                title: "OneMoney USD",
                rows: [
                  { id: "daily", title: "Daily - $0.10", description: "Daily package." },
                  { id: "weekly", title: "Weekly - $0.50", description: "Weekly package." },
                  { id: "monthly", title: "Monthlys - $0.90", description: "Monthly package." },
                  ],
              },
      
            ],
            button: "Menu",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}

/************************************ Soil testing PAYMENTS FUNCTION**************************************** */

export async function sendSoilTestingPaymentOptions(businessPhoneNumberId, user) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Choose Payment Method",
          },
          body: {
            text: "Please select prefered payment method & currency.",
          },
          footer: {
            text: "ARDA V-30 Farmer.",
          },
          action: {
            sections: [
              
              {
                title: "OneMoney USD",
                rows: [
                  { id: "daily", title: "$10", description: "pH Only" },
                  { id: "weekly", title: "$15", description: "Full Analysis" },
                  { id: "monthly", title: "$20", description: "Full Analysis + Recommendations" },
                  ],
              },

            ],
            button: "Menu",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}

/************************************ TRACTOR SERVICES FUNCTION**************************************** */

export async function sendTractorServicesOptions(businessPhoneNumberId, user) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Choose Payment Method",
          },
          body: {
            text: "Please select prefered payment method & currency.",
          },
          footer: {
            text: "ARDA V-30 Farmer.",
          },
          action: {
            sections: [
              
              {
                title: "OneMoney",
                rows: [
                  { id: "daily", title: "$75", description: "Ploughing" },
                  { id: "weekly", title: "$65", description: "Discing" },
                  { id: "monthly", title: "$50", description: "Planting" },
                  { id: "weekly1", title: "$35", description: "Spraying" },
                  { id: "monthly1", title: "$75", description: "Combine Harvesting" },
                  ],
              },
            ],
            button: "Menu",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}

/************************************MAIN MENU FUNCTION**************************************** */
export async function sendOptionsFunction(businessPhoneNumberId, user) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "ARDA V-30",
          },
          body: {
            text: "Welcome to ARDA V-30 Farmer Digital Assistant.",
          },
          footer: {
            text: "Food Security, Everyday, Everywhere.",
          },
          action: {
            sections: [
              
              {
                title: "Menu",
                rows: [
                  { id: "farming_tips", title: "Farming Tips", description: "Get expert agronomy advice on various farming activities." },
                  { id: "micro_credit", title: "Micro Credit", description: "Get micro financial assistance to help you." },
                  { id: "farming_news", title: "Farming News", description: "Get current updates on farming, markets, climate and more." },
                  { id: "joint_venture", title: "Joint Venture", description: "Join the ARDA JV Program for the upcoming season and have access to farming inputs." },
                  { id: "airtime", title: "Airtime", description: "Buy airtime and stay connect all the time." },
                ],
              },
              {
                title: "Menu",
                rows: [
                  { id: "soil_testing", title: "Soil Testing", description: "Get your soil tested and know how best to manage your soils." },
                  { id: "tractor_services", title: "Tillage & Harvesting", description: "Access ARDA tillage & Combine Harvesting services." },
                  { id: "help", title: "Help", description: "Contact our customer experience team." },
                ],
              },
            ],
            button: "Menu",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}


export async function sendMenu(businessPhoneNumberId, user) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: user,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "ARDA V-30 Farmer",
          },
          body: {
            text: "Welcome to ARDA V-30 Farmer Digital Assistant.",
          },
          footer: {
            text: "Food Security, Everyday, Everywhere.",
          },
          action: {
            sections: [
              
              {
                title: "ARDA V-30 Farmer",
                rows: [
                   { id: "farming_tips", title: "Farming Tips", description: "Get expert agronomy advice on various farming activities." },
                  { id: "micro_credit", title: "Micro Credit", description: "Get micro financial assistance to help you." },
                  { id: "farming_news", title: "Farming News", description: "Get current updates on farming, markets, climate and more." },
                  { id: "joint_venture", title: "Joint Venture", description: "Join the upcoming season's JV program and access farming inputs." },
                  { id: "airtime", title: "Airtime", description: "Buy airtime and stay connect all the time." },
                ],
              },
              {
                title: "ARDA V-30 Farmer",
                rows: [
                  { id: "soil_testing", title: "Soil Testing", description: "Get your soil tested and know how best to manage your soils." },
                  { id: "tractor_services", title: "Tillage & Harvesting", description: "Access ARDA tillage & Combine Harvesting services." },
                  { id: "help", title: "Help", description: "Contact our customer experience team." },
                ],
              },
            ],
            button: "ARDA V-30 Farmer",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error sending interactive list message:", error.message);
  }
}