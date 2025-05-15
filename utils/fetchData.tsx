import firestore from '@react-native-firebase/firestore';

type Transaction = {
  id: string;
  amount: number;
  transactionType: 'income' | 'expense';
  [key: string]: any;
};

type FirestoreItem = {
  id: string;
  [key: string]: any;
};

export const fetchUserData = async (uid: string) => {
  try {
    const transactionsRef = firestore().collection(`users/${uid}/transactions`);
    const infoRef = firestore().doc(`users/${uid}/personal/info`);
    const billsRef = firestore().collection(`users/${uid}/bills`);

    const [transactionsSnap, infoSnap, billsSnap] = await Promise.all([
      transactionsRef.get(),
      infoRef.get(),
      billsRef.get(),
    ]);

    const parseDocs = (snap: FirebaseFirestoreTypes.QuerySnapshot): FirestoreItem[] =>
      snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const transactions = parseDocs(transactionsSnap) as Transaction[];

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount);
      if (!isNaN(amt)) {
        if (tx.transactionType === 'income') income += amt;
        else if (tx.transactionType === 'expense') expense += amt;
      }
    });

    const profile = infoSnap.exists ? { id: infoSnap.id, ...infoSnap.data() } : null;

    return {
      balanceData: { income, expense },
      transactions,
      profile,
      bills: parseDocs(billsSnap),
    };

  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      balanceData: { income: 0, expense: 0 },
      transactions: [],
      profile: null,
      bills: [],
    };
  }
};
