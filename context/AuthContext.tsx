"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

interface UserProfile {
    hasPaidSubscription?: boolean;
    subscriptionTier?: string;
    // Add other profile fields as needed
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
    hasPaidSubscription: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userProfile: null,
    hasPaidSubscription: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Presence Tracking
    useEffect(() => {
        if (!user) return;

        const updatePresence = async () => {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    lastSeen: serverTimestamp(),
                }, { merge: true });
            } catch (err) {
                console.error("Presence update failed:", err);
            }
        };

        // Update immediately on login
        updatePresence();

        // Update every 60 seconds
        const interval = setInterval(updatePresence, 60000);

        return () => clearInterval(interval);
    }, [user]);

    const hasPaidSubscription = userProfile?.hasPaidSubscription === true;

    return (
        <AuthContext.Provider value={{ user, loading, userProfile, hasPaidSubscription }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
