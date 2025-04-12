// // services/notificationHandler.ts
// import { isFinancialMessage, parseMessage, saveParsedTransaction } from '../util/msgParser'
// import messaging from '@react-native-firebase/messaging' // For FCM or foreground listener

// export const handleNotification = async (remoteMessage: any, uid: string) => {
//   const message = remoteMessage?.notification?.body

//   if (message && isFinancialMessage(message)) {
//     const parsed = parseMessage(message)
//     if (parsed) {
//       await saveParsedTransaction(uid, parsed)
//     }
//   }
// }
