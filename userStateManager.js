//userStateManager.js

import connection from "./db.js";

// Use a Map for better in-memory state management
export let userStatesMap = new Map();

// Helper function to initialize user state
export const initializeUserState = (user) => {
  if (!userStatesMap.has(user)) {
    userStatesMap.set(user, {
      messageState: null,  
      moduleName: null,
      tipCategory: null,
      tipSubCategory: null,
      tipStage: null,
      package: null,
      jvCrop: null,
      farmName: null,
      hectares: null,
      hectaresToRegister: null,
      amount: 0,
      airtimePhone: null,
      paymentPhone: null,
      currency: null    
    });
  }
};

// Function to set the user message state manually
export const setMessageState = (user, newMessageState) => {
  initializeUserState(user);
  userStatesMap.get(user).messageState = newMessageState;
  console.log(`Message State for user ${user}: ${newMessageState}`);
};

// Function to set the user message state manually
export const setHectaresToRegister = (user, newHectaresToRegister) => {
  initializeUserState(user);
  userStatesMap.get(user).hectaresToRegister = newHectaresToRegister;
  console.log(`HectaresToRegister set for user ${user}: ${newHectaresToRegister}`);
};

// Function to set the user message state manually
export const setHectares = (user, newHectares) => {
  initializeUserState(user);
  userStatesMap.get(user).hectares = newHectares;
  console.log(`Hectares set for user ${user}: ${newHectares}`);
};

export const setFarmName = (user, newFarmName) => {
  initializeUserState(user);
  userStatesMap.get(user).farmName = newFarmName;
  console.log(`FarmName set for user ${user}: ${newFarmName}`);
};

// Function to set the user message state manually
export const setJvCrop = (user, newJvCrop) => {
  initializeUserState(user);
  userStatesMap.get(user).jvCrop = newJvCrop;
  console.log(`JV Crop set for user ${user}: ${newJvCrop}`);
};

// Function to set the user message state manually
export const setAmount = (user, newAmount) => {
  initializeUserState(user);
  userStatesMap.get(user).amount = newAmount;
  console.log(`Amount for user ${user}: ${newAmount}`);
};

// Function to set the user message state manually
export const setPaymentPhone = (user, newPaymentPhone) => {
  initializeUserState(user);
  userStatesMap.get(user).paymentPhone = newPaymentPhone;
  console.log(`PaymentPhone for user ${user}: ${newPaymentPhone}`);
};

// Function to set the user message state manually
export const setAirtimePhone= (user, newAirtimePhone) => {
  initializeUserState(user);
  userStatesMap.get(user).airtimePhone = newAirtimePhone;
  console.log(`AirtimePhone for user ${user}: ${newAirtimePhone}`);
};

// Function to set the user message state manually
export const setTipSubCategory = (user, newTipSubCategory) => {
  initializeUserState(user);
  userStatesMap.get(user).tipSubCategory = newTipSubCategory;
  console.log(`TipSubCategory for user ${user}: ${newTipSubCategory}`);
};

// Function to set the user message state manually
export const setCurrency = (user, newCurrency) => {
  initializeUserState(user);
  userStatesMap.get(user).currency = newCurrency;
  console.log(`Currency for user ${user}: ${newCurrency}`);
};

// Function to set the user message state manually
export const setPackage = (user, newPackage) => {
  initializeUserState(user);
  userStatesMap.get(user).package = newPackage;
  console.log(`Package for user ${user}: ${newPackage}`);
};

// Function to set the user message state manually
export const setTipStage = (user, newTipStage) => {
  initializeUserState(user);
  userStatesMap.get(user).tipStage = newTipStage;
  console.log(`TipStage for user ${user}: ${newTipStage}`);
};

// Function to set the user message state manually
export const setTipCategory = (user, newTipCategory) => {
  initializeUserState(user);
  userStatesMap.get(user).tipCategory = newTipCategory;
  console.log(`TipCategory for user ${user}: ${newTipCategory}`);
};

// Function to set the user message state manually
export const setModuleName = (user, newModuleName) => {
  initializeUserState(user);
  userStatesMap.get(user).moduleName = newModuleName;
  console.log(`ModuleName for user ${user}: ${newModuleName}`);
};

// Function to set the user message state manually
export const setMessage = (user, newMessage) => {
  initializeUserState(user);
  userStatesMap.get(user).message = newMessage;
  console.log(`Message Variable for user set ${user}: ${newMessage}`);
};


// Function to set the user message state manually
export const setUserName = (user, newUserName) => {
  initializeUserState(user);
  userStatesMap.get(user).userName = newUserName;
  console.log(`Message Variable for user set ${user}: ${newUserName}`);
};


// Function to reset user data
export const resetUserData = (user) => {
  if (userStatesMap.has(user)) {
    const userState = userStatesMap.get(user);
    if (userState.timerId) {
      clearTimeout(userState.timerId);
      console.log(`Timer cleared for user ${user}`);
    }

    userStatesMap.delete(user);
    connection.execute('DELETE FROM answers WHERE user_phone = ?', [user]);
    console.log(`User data for ${user} has been reset`);
  }
};