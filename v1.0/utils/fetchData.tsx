// import { db } from "@/utils/firebaseConfig";
// import { getDocs, collection, QuerySnapshot, DocumentData } from "firebase/firestore";

// // Define transaction type
// type Transaction = {
//   id: string;
//   amount: number;
//   transactionType: "income" | "expense";
//   [key: string]: any;
// };

// type FirestoreItem = {
//   id: string;
//   [key: string]: any;
// };

// export const fetchUserData = async (uid: string) => {
//   try {
//     const [transactionsSnap, goalsSnap, billsSnap] = await Promise.all([
//       getDocs(collection(db, `users/${uid}/transactions`)),
//       getDocs(collection(db, `users/${uid}/goals`)),
//       getDocs(collection(db, `users/${uid}/bills`)),
//     ]);

//     const parseDocs = (snap: QuerySnapshot<DocumentData>): FirestoreItem[] =>
//       snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const transactions = parseDocs(transactionsSnap) as Transaction[];

//     let income = 0;
//     let expense = 0;

//     transactions.forEach((tx) => {
//       if (tx.transactionType === "income") income += tx.amount;
//       else if (tx.transactionType === "expense") expense -= tx.amount;
//     });

//     const balance = income + expense;

//     return {
//       balanceData: {
//         income,
//         expense: -expense, // so it’s positive in output
//         balance,
//       },
//       transactions,
//       goals: parseDocs(goalsSnap),
//       bills: parseDocs(billsSnap),
//     };
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return {
//       balanceData: {
//         income: 0,
//         expense: 0,
//         balance: 0,
//       },
//       transactions: [],
//       goals: [],
//       bills: [],
//     };
//   }
// };
