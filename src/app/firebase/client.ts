import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { collection, getFirestore, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Product } from '@/app/types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseStoreId = import.meta.env.VITE_FIREBASE_STORE_ID || import.meta.env.VITE_STORE_ID || '';
export const firebaseFunctionsRegion = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1';

export const isFirebaseBackendConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseStoreId
);

let appInstance: ReturnType<typeof initializeApp> | null = null;

function getAppInstance() {
  if (!appInstance) {
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
}

function getFirebaseAuth() {
  return getAuth(getAppInstance());
}

function getFirebaseDb() {
  return getFirestore(getAppInstance());
}

function getFirebaseFunctions() {
  return getFunctions(getAppInstance(), firebaseFunctionsRegion);
}

function normalizeCategory(value: unknown): 'core' | 'seasonal' {
  return value === 'seasonal' ? 'seasonal' : 'core';
}

function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
}

function normalizePrice(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

function mapDocumentToProduct(docId: string, data: Record<string, unknown>): Product {
  const tastingFromObject =
    data.tastingNotes && typeof data.tastingNotes === 'object'
      ? (data.tastingNotes as Record<string, unknown>)
      : {};

  return {
    id: normalizeText(data.id, docId),
    name: normalizeText(data.name, 'Untitled Product'),
    category: normalizeCategory(data.category),
    description: normalizeText(data.description),
    tastingNotes: {
      aroma: normalizeText(tastingFromObject.aroma ?? data.aroma),
      flavor: normalizeText(tastingFromObject.flavor ?? data.flavor),
      body: normalizeText(tastingFromObject.body ?? data.body),
      finish: normalizeText(tastingFromObject.finish ?? data.finish)
    },
    price: normalizePrice(data.price),
    image: normalizeText(data.image),
    beanType: normalizeText(data.beanType, 'Whole Bean')
  };
}

export function subscribeToTenantProducts(
  storeId: string,
  onProducts: (products: Product[]) => void,
  onError: (error: Error) => void
) {
  const productsRef = collection(getFirebaseDb(), `stores/${storeId}/products`);

  return onSnapshot(
    productsRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const products = snapshot.docs.map((doc) =>
        mapDocumentToProduct(doc.id, doc.data() as Record<string, unknown>)
      );
      onProducts(products);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function adminSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function adminSignOut() {
  return signOut(getFirebaseAuth());
}

export function onAdminAuthStateChange(listener: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), listener);
}

export async function getUserStoreIdFromClaims(user: User, forceRefresh = false) {
  const tokenResult = await user.getIdTokenResult(forceRefresh);
  const storeIdClaim = tokenResult.claims.storeId;
  if (typeof storeIdClaim === 'string') {
    return storeIdClaim;
  }
  return '';
}

export async function getUserRoleFromClaims(user: User, forceRefresh = false) {
  const tokenResult = await user.getIdTokenResult(forceRefresh);
  const roleClaim = tokenResult.claims.role;
  if (typeof roleClaim === 'string') {
    return roleClaim;
  }
  return '';
}

export async function bootstrapAdminClaims(storeId: string) {
  const callable = httpsCallable(getFirebaseFunctions(), 'bootstrapAdminClaims');
  await callable({ storeId });
}

async function callTenantFunction(functionName: string, storeId: string, payload: Record<string, unknown>) {
  const callable = httpsCallable(getFirebaseFunctions(), functionName);
  await callable({ ...payload, storeId });
}

export async function createTenantProduct(storeId: string, productData: Product) {
  await callTenantFunction('addProduct', storeId, { productData });
}

export async function updateTenantProduct(storeId: string, productId: string, updates: Partial<Product>) {
  await callTenantFunction('updateProduct', storeId, { productId, updates });
}

export async function deleteTenantProduct(storeId: string, productId: string) {
  await callTenantFunction('deleteProduct', storeId, { productId });
}
