// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(undefined);

// // Dummy user for demo
// const dummyUser = {
//   id: '1',
//   name: 'John Doe',
//   email: 'john@example.com',
//   avatar: undefined,
// };

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setUser(dummyUser);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const signup = async (name, email, password) => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setUser({ ...dummyUser, name, email });
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       isAuthenticated: !!user, 
//       login, 
//       logout, 
//       signup 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Listen to auth state (important)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Google login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // 🔹 Email login
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 Email signup
  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // displayName can be updated later if needed

    await updateProfile(result.user, { displayName: name });
  };

  // 🔹 Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
