
# EliteFit - React Native Fitness App

EliteFit is a React Native mobile application built with Expo, designed to help users track their fitness journey. It features a smooth onboarding process, authentication, a tab-based interface for home, stats, plans, and profile settings, and integrates with a backend API for data persistence.

## Features

- **Splash Screen**: Custom splash screen with logo animation.
- **Onboarding**: Multi-step form to personalize user experience (experience level, age, weight, height, gender).
- **Authentication**: Login, signup, and forgot password functionality with token storage.
- **Tab Navigation**: Home (workouts), Stats (activity tracking), Plans (goal setting), Profile (settings).
- **Styling**: Tailwind CSS-like styling with `tailwind-react-native-classnames`.
- **API Integration**: Uses `axios` for backend communication (e.g., onboarding, auth).
- **Charts**: Visualizes activity data (requires `react-native-chart-kit` setup).
- **TypeScript**: Fully typed codebase for better developer experience.

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later (or use Yarn/pnpm)
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Backend**: A running backend server (replace `http://YOUR_MACHINE_IP:5000` with your API URL)

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
- **Backend URL**: Update API endpoints in `Onboarding.tsx`, `login.tsx`, and `signup.tsx`:
  ```tsx
  axios.post("http://YOUR_MACHINE_IP:5000/api/endpoint", data);
  ```
  Replace `YOUR_MACHINE_IP` with your backend server's IP or domain.

### 4. Run the App
```bash
npx expo start
```
- Open in iOS Simulator: Press `i`
- Open in Android Emulator: Press `a`
- Scan QR code with Expo Go app on a physical device.

### 5. Build for Production (Optional)
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
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgotPassword.tsx
│   ├── _layout.tsx        # Root layout with splash screen
│   ├── index.tsx          # Entry screen (Get Started)
│   ├── Onboarding.tsx     # Onboarding screen
│   └── +not-found.tsx     # Fallback for undefined routes
├── expo.json              # Expo configuration
├── tsconfig.json          # TypeScript configuration
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
- `tailwind-react-native-classnames@^1.3.1`: Tailwind CSS styling
- `@react-native-async-storage/async-storage@^1.23.0`: Persistent storage
- `axios@^1.6.0`: HTTP client
- `zod@^3.22.0`: Schema validation
- `@expo/vector-icons@^14.0.0`: Icon library
- `date-fns@^3.6.0`: Date manipulation
- `react-native-chart-kit@^6.12.0`: Chart visualization
- `react-native-svg@^15.2.0`: SVG support for charts

### Development Dependencies
- `@babel/core@^7.20.0`: Babel compiler
- `@types/react@~18.2.0`: TypeScript types for React
- `typescript@^5.1.0`: TypeScript support

Install all dependencies with:
```bash
npx expo install expo-router expo-splash-screen expo-linear-gradient @react-native-async-storage/async-storage @expo/vector-icons react-native-svg
npm install tailwind-react-native-classnames axios zod date-fns react-native-chart-kit
npm install --save-dev @types/react typescript
```

## Notes
- **Charts**: `stats.tsx` uses `react-native-chart-kit`. Replace placeholder chart code with actual data:
  ```tsx
  <LineChart
    data={{ labels: ["Mon", "Tue", "Wed"], datasets: [{ data: [20, 45, 28] }] }}
    width={Dimensions.get("window").width - 32}
    height={220}
    chartConfig={{ backgroundColor: "#fff", color: () => "#0052FF" }}
  />
  ```
- **Icons**: `lucide-react` was replaced with `@expo/vector-icons` (Ionicons). Adjust icon names accordingly (e.g., `Bell` → `notifications-outline`).
- **Backend**: Ensure your backend supports endpoints like `/api/onboarding`, `/api/auth/login`, `/api/auth/signup`.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request.

## License
This project is unlicensed (for personal use). Modify as needed for distribution.

---

### Customization
- Replace `<repository-url>` with your actual Git repo URL if applicable.
- Add a backend setup section if you have specific instructions (e.g., a Node.js server).
- Update the license section if you choose one (e.g., MIT).

Save this as `README.md` in your project root, and it’ll provide clear guidance for setup and usage! Let me know if you need adjustments.
