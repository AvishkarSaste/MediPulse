import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  createdAt: string;
  lastLoginAt: string;
}

interface FirebaseAuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await updateLastLoginTime(userCredential.user.uid);
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name,
        role: role as 'admin' | 'doctor' | 'patient',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      setUserProfile(userProfile);

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });
      
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const updateLastLoginTime = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
    } catch (error) {
      console.error('Error updating last login time:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    updateUserProfile,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
