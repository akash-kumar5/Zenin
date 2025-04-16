# Zenin

Zenin is a personal finance tracking app built with React Native and Firebase. It helps users manage expenses, visualize spending, and stay on top of their financial goals.

---

## Features

- Secure user authentication (Firebase Auth)
- Add and manage income and expenses
- Visualize spending with graphs
- Custom categories and labels
- Multi-user support with isolated data
- Image attachment for receipts (optional)
- Simple and clean UI using Tailwind (NativeWind)

---

## Tech Stack

- React Native (Expo)
- Firebase Firestore and Authentication
- NativeWind (Tailwind CSS for RN)

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/akash-kumar5/Zenin.git
   cd V1.0

2. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
3. Enable Firestore and Authentication
4. Add your Firebase config to the project

To run the app:
```bash
npm start
```

## Folder Structure
```
Zenin/
├── app/
│   ├── (tabs)/               # Tab-based navigation and main screens
│   │   ├── _layout.tsx
│   │   ├── analytics.tsx
│   │   ├── deals.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   └── transactions.tsx
│   ├── auth/                 # Auth-related screens
│   ├── components/           # Reusable components (form fields, UI)
│   ├── screens/              # Standalone screens
│   ├── _layout.tsx
│   └── +not-found.tsx
├── assets/                   # Images and icons
├── components/               # Global reusable components
├── constants/                # Constants and enums
├── dist/                     # Build output
├── hooks/                    # Custom hooks
├── node_modules/
├── services/                 # Firebase and utility services
├── styles/                   # Tailwind and custom styles
├── utils/                    # Utility functions
├── .easignore
├── .gitignore
├── app.json
├── eas.json
├── expo-env.d.ts
├── package.json
├── README.md
├── tsconfig.json
├── yarn.lock

```

## Screenshots
(To be added in a `/screenshots` folder)

## Roadmap
- SMS-based auto expense tracking
- OCR for receipt capture
- AI-generated financial tips
- Export to Excel/PDF
- Budget planning and goals

## Author
Akash Kumar  
[GitHub](https://github.com/akash-kumar5)  
[LinkedIn](https://www.linkedin.com/in/-akash-kumar/)
