import { Client, Account, ID, Databases, Storage, Avatars, Query, AppwriteException } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67b88107003594415405",
  databaseId: "67b884a8003633ab51ce",
  userCollectionId: "67b884a8003633ab51ce",
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client); // Ensure this matches the SDK's Account class
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

// Register user
export async function createUser(email: string, password: string, username: string): Promise<any> {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
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

    return newUser;
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 409) {
        throw new Error("Email already exists. Please use a different email or log in.");
      }
    }
    throw new Error(error.message || "An error occurred during signup.");
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    console.log("Account object:", account); // Debug the account object
    console.log("Creating email session with:", { email, password });
    const session = await account.createEmailSession(email, password); // Verify this method exists
    console.log("Session created:", session);
    return session;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw new Error(error.message || "Login failed due to an unexpected error.");
  }
}

// Get Account
export async function getAccount() {
  try {
    return await account.get();
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error("No account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) throw Error("User not found");

    return currentUser.documents[0];
  } catch (error) {
    console.log("Get Current User Error:", error.message);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    throw new Error(error.message);
  }
}

// Add this at the bottom of lib/appwrite.ts for testing
export function testAccountMethods() {
  console.log("Account methods:", Object.keys(account));
  console.log("createEmailSession exists:", typeof account.createEmailSession === 'function');
}