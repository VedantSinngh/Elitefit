import { Client, Account, ID, Databases, Storage, Avatars, Query, AppwriteException } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67b88107003594415405",
  databaseId: "67b884a8003633ab51ce",
  userCollectionId: "67b884f3001243dd6d53",
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    console.log("New account created:", newAccount);
    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    console.log("User document created:", newUser);

    return newUser;
  } catch (error) {
    console.error("Create user error:", error);
    if (error instanceof AppwriteException) {
      if (error.code === 409) {
        throw new Error("Email already exists. Please use a different email or log in.");
      }
    }
    throw new Error(error.message || "An error occurred during signup.");
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    // Check for existing session
    try {
      const currentSession = await account.getSession('current');
      console.log("Existing session found:", currentSession);
      return currentSession;
    } catch (error) {
      console.log("No active session, proceeding to create one");
    }

    console.log("Creating email session with:", { email });
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session);
    return session;
  } catch (error) {
    console.error("Sign-in error:", error);
    if (error instanceof AppwriteException) {
      if (error.code === 401) {
        throw new Error("Invalid email or password.");
      }
      if (error.code === 409) {
        throw new Error("A session is already active. Please sign out first.");
      }
    }
    throw new Error(error.message || "Login failed due to an unexpected error.");
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    console.log("Current account fetched:", currentAccount);
    return currentAccount;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Current User (Updated to fallback to account)
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No account found");

    try {
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
      console.log("Database query result:", currentUser);

      if (!currentUser || currentUser.documents.length === 0) {
        console.log("No user document found, returning account info:", currentAccount.$id);
        return currentAccount; // Fallback to account info
      }

      return currentUser.documents[0];
    } catch (dbError) {
      console.error("Database query failed:", dbError.message);
      console.log("Falling back to account info:", currentAccount);
      return currentAccount; // Fallback if database query fails
    }
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    await account.deleteSession("current");
    console.log("Session deleted successfully");
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error(error.message);
  }
}

// Test account methods
export function testAccountMethods() {
  console.log("Account methods:", Object.keys(account));
  console.log("createEmailPasswordSession exists:", typeof account.createEmailPasswordSession === 'function');
}