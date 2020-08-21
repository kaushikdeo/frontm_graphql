module.exports = {
  Query: {
    // ---------------PROTECTED QUERY---------------
    greetings: async (parent, {}, {db}) => {
      return "Hello World";
    },
  },
};


// loginUser: async (parent, {loginMobile}, {db}) => {
//   let response = {
//     success: false,
//     code: 400,
//     message: "User Does Not Exist",
//   };
//   const isUser = await db.collection('users').findOne({"loginMobile.countryCode": loginMobile.countryCode, "loginMobile.mobileNumber": loginMobile.mobileNumber});
//   if (isUser) {
//     response = {
//       success: true,
//       code: 200,
//       message: "User Successfully Logged In",
//     };
//   }
//   return response;
// },

// createCard: async (parent, { createCardData, userId,progress }, { db }) => {
//   let response = {
//     success: false,
//     code: 400,
//     message: "Unable to Create a new card",
//   };
//   // check if the user exists
//   const isUser = await db.collection('users').findOne({ _id: ObjectID(userId)});
//   if (!isUser) {
//     response = {
//       success: false,
//       code: 200,
//       message: "User Doesnot exist",
//     }
//   } else {
//     const newCard = {
//       _id: ObjectID(),
//       ...createCardData,
//     }
//     const addNewCard = await db.collection('cards').insertOne(newCard);
//     const addCardToUser = await db.collection('users').findOneAndUpdate({ _id: ObjectID(userId)}, { $addToSet: { cards: addNewCard.ops[0]._id }});
//     if (addNewCard && addNewCard.ops && addNewCard.ops[0]) {
//       response = {
//         success: true,
//         code: 200,
//         message: "Business Card Successfully created",
//       };
//     };
//   }
//   return response;
// },