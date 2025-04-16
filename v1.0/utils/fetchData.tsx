import { db } from "@/utils/firebaseConfig";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";

// Define transaction type
type Transaction = {
  id: string;
  amount: number;
  transactionType: "income" | "expense";
  [key: string]: any;
};

type FirestoreItem = {
  id: string;
  [key: string]: any;
};

export const fetchUserData = async (uid: string) => {
  try {
    const [transactionsSnap, infoSnap, billsSnap] = await Promise.all([
      getDocs(collection(db, `users/${uid}/transactions`)),
      getDoc(doc(db, `users/${uid}/personal/info`)), // fix here
      getDocs(collection(db, `users/${uid}/bills`)),
    ]);

    const parseDocs = (snap: any): FirestoreItem[] =>
      snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const transactions = parseDocs(transactionsSnap) as Transaction[];

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount);
      if (!isNaN(amt)) {
        if (tx.transactionType === "income") income += amt;
        else if (tx.transactionType === "expense") expense += amt;
      }
    });

    const profile = infoSnap.exists() ? { id: infoSnap.id, ...infoSnap.data() } : null;

    return {
      balanceData: {
        income,
        expense,
      },
      transactions,
      profile,
      bills: parseDocs(billsSnap),
    };

  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      balanceData: {
        income: 0,
        expense: 0,
      },
      transactions: [],
      profile: null,
      bills: [],
    };
  }
};
