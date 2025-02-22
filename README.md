Below is a fully updated `README.md` for your EliteFit project, incorporating the latest details from your code, the Appwrite integration we’ve worked on, and ensuring it reflects the current state of your React Native fitness app built with Expo. This version includes updated prerequisites, setup instructions, project structure, dependencies, and notes based on our recent work to ensure successful login functionality with Appwrite.

---

# EliteFit - React Native Fitness App

EliteFit is a React Native mobile application built with Expo, designed to help users track their fitness journey. It features a smooth onboarding process, Appwrite-based authentication, a tab-based interface for home, stats, plans, and profile settings, and integrates with Appwrite for data persistence.

## Features

- **Splash Screen**: Custom splash screen with logo animation.
- **Onboarding**: Multi-step form to personalize user experience (experience level, age, weight, height, gender).
- **Authentication**: Login, signup, and forgot password functionality using Appwrite with session management.
- **Tab Navigation**: Home (workouts), Stats (activity tracking), Plans (goal setting), Profile (settings).
- **Styling**: Tailwind CSS-like styling with `tailwind-react-native-classnames`.
- **Appwrite Integration**: Uses `react-native-appwrite` for backend communication (authentication, user data storage).
- **Charts**: Visualizes activity data (requires `react-native-chart-kit` setup).
- **JavaScript**: Fully functional codebase (TypeScript optional).

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later (or use Yarn/pnpm)
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Appwrite**: A running Appwrite instance (e.g., `https://cloud.appwrite.io/v1`) with:
  - Project ID: `67b88107003594415405`
  - Database ID: `67b884a8003633ab51ce`
  - User Collection ID: `67b884f3001243dd6d53`
- **Expo Go**: App for testing on physical devices (optional).

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EliteFit
```

### 2. Install Dependencies
```bash
npm install
```
This installs all required dependencies listed in `package.json`.

### 3. Configure Environment
- **Assets**: Ensure the following images are in `assets/images/`:
  - `icon.png`
  - `adaptive-icon.png`
  - `splash.png`
  - `logo.png`
  - `favicon.png`
- **Appwrite Configuration**: Verify `lib/appwrite.ts` matches your Appwrite setup:
  ```javascript
  export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "67b88107003594415405",
    databaseId: "67b884a8003633ab51ce",
    userCollectionId: "67b884f3001243dd6d53",
  };
  ```
  - Replace values if using a custom Appwrite instance.
- **Appwrite Dashboard Setup**:
  - Log in to `https://cloud.appwrite.io`.
  - Create a project with ID `67b88107003594415405` (or update the code with your project ID).
  - Create a database (`67b884a8003633ab51ce`) and a collection (`67b884f3001243dd6d53`).
  - Add attributes to the collection: `accountId` (string), `email` (string), `username` (string), `avatar` (string).
  - Set permissions: `role:all` with `read` and `write` access (for testing).

### 4. Run the App
```bash
npx expo start
```
- Open in iOS Simulator: Press `i`
- Open in Android Emulator: Press `a`
- Open in Web: Press `w`
- Scan QR code with Expo Go app on a physical device.

### 5. Test Authentication
- **Signup**: Use the signup screen to create a user:
  - Email: `test@example.com`
  - Password: `password123`
  - Username: `TestUser`
- **Login**: Use the login screen with the same credentials.
- **Sign Out**: Test the sign-out functionality to clear sessions.

### 6. Build for Production (Optional)
- iOS: `npx expo run:ios`
- Android: `npx expo run:android`

## Project Structure

```
EliteFit/
├── assets/                # Static assets (images)
│   ├── images/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash.png
│   │   ├── logo.png
│   │   └── favicon.png
├── app/                   # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── index.tsx      # Home screen
│   │   ├── stats.tsx      # Stats screen
│   │   ├── plans.tsx      # Plans screen
│   │   └── profile.tsx    # Profile screen
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   ├── signup.tsx     # Signup screen
│   │   └── forgotPassword.tsx # Forgot password screen
│   ├── _layout.tsx        # Root layout with splash screen
│   ├── index.tsx          # Entry screen (Get Started)
│   ├── Onboarding.tsx     # Onboarding screen
│   └── +not-found.tsx     # Fallback for undefined routes
├── lib/                   # Utility and backend integration
│   └── appwrite.ts        # Appwrite client and functions
├── expo.json              # Expo configuration
├── tsconfig.json          # TypeScript configuration (optional)
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Dependencies

### Runtime Dependencies
- `expo@~51.0.0`: Core Expo SDK
- `expo-router@^3.5.0`: File-based routing
- `expo-splash-screen@~0.27.0`: Splash screen management
- `expo-linear-gradient@~13.0.0`: Gradient backgrounds
- `react@18.2.0`: React library
- `react-native@0.74.0`: React Native library
- `react-native-appwrite@^0.4.0`: Appwrite SDK for React Native
- `tailwind-react-native-classnames@^1.3.1`: Tailwind CSS styling
- `@react-native-async-storage/async-storage@^1.23.0`: Persistent storage (optional for token management)
- `axios@^1.6.0`: HTTP client (used in onboarding)
- `zod@^3.22.0`: Schema validation (optional)
- `@expo/vector-icons@^14.0.0`: Icon library
- `date-fns@^3.6.0`: Date manipulation
- `react-native-chart-kit@^6.12.0`: Chart visualization
- `react-native-svg@^15.2.0`: SVG support for charts

### Development Dependencies
- `@babel/core@^7.20.0`: Babel compiler
- `@types/react@~18.2.0`: TypeScript types for React (optional)
- `typescript@^5.1.0`: TypeScript support (optional)

Install all dependencies with:
```bash
npx expo install expo-router expo-splash-screen expo-linear-gradient @react-native-async-storage/async-storage @expo/vector-icons react-native-svg
npm install react-native-appwrite tailwind-react-native-classnames axios zod date-fns react-native-chart-kit
npm install --save-dev @babel/core @types/react typescript
```

## Notes
- **Authentication**:
  - Uses Appwrite for login/signup with session management via `react-native-appwrite`.
  - Ensure users are created with matching documents in the database (see `lib/appwrite.ts`).
  - Test with: Email: `test@example.com`, Password: `password123`.

- **Charts**:
  - `stats.tsx` uses `react-native-chart-kit`. Example usage:
    ```tsx
    <LineChart
      data={{ labels: ["Mon", "Tue", "Wed"], datasets: [{ data: [20, 45, 28] }] }}
      width={Dimensions.get("window").width - 32}
      height={220}
      chartConfig={{ backgroundColor: "#fff", color: () => "#0052FF" }}
    />
    ```
  - Replace with actual data from your backend or Appwrite.

- **Icons**:
  - Uses `@expo/vector-icons` (Ionicons). Example: `<Ionicons name="notifications-outline" size={24} color="black" />`.

- **Appwrite**:
  - Project ID: `67b88107003594415405`
  - Database: `67b884a8003633ab51ce`, Collection: `67b884f3001243dd6d53`
  - Ensure collection has attributes: `accountId`, `email`, `username`, `avatar`.
  - Add a test user manually if needed:
    - **Users**: Add `test@example.com`, `password123`.
    - **Collection**: Add document with `accountId` matching the user’s `$id`.

- **Onboarding**:
  - Currently uses `axios` for a backend API. Update to use Appwrite if replacing the backend.

## Troubleshooting
- **Login Fails (401)**:
  - Verify email/password match a user in Appwrite’s **Users** section.
  - Check console logs in `signIn` for detailed errors.

- **User Not Found in Database**:
  - Ensure `createUser` adds a document to `67b884f3001243dd6d53` with the correct `accountId`.
  - Manually add a document in Appwrite if signup fails.

- **Session Conflicts**:
  - Use the "Sign Out" button to clear active sessions before logging in again.

- **No Navigation**:
  - Confirm `app/(tabs)/index.tsx` exists and is configured correctly.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request.

## License
This project is unlicensed (for personal use). Modify as needed for distribution.

---

### Customization Notes
- Replace `<repository-url>` with your actual Git repository URL if applicable.
- If you’re using a custom Appwrite instance (not `cloud.appwrite.io`), update the `endpoint` and provide setup instructions.
- If you add more features (e.g., workout tracking), update the **Features** section accordingly.

This README reflects your current project state, including the Appwrite integration we’ve debugged. Test the app with the instructions provided, and let me know if you need further adjustments!
