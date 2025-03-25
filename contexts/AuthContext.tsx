import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { TablesInsert } from "../types/database.types";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userId: string | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserId(session?.user?.id ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserId(session?.user?.id ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user record without specifying the id field
        // as it's an identity column that gets created automatically
        const newUser: TablesInsert<"Users"> = {
          userid: data.user.id, // Store the auth UUID in the userid field
          created_at: new Date().toISOString(),
          Assets: null,
          ExpenseBreak: null,
          Expenses: null,
          Income: null,
          Liabilites: null,
          TrueWage: null,
        };

        const { error: profileError } = await supabase
          .from("Users")
          .insert([newUser]);

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      setUserId(data.user?.id ?? null);

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, user, userId, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
