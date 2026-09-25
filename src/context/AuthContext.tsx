'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  status: string;
  avatarUrl?: string;
  traineeProfile?: any;
  trainerProfile?: any;
  notifications?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (formData: any) => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: (role: 'TRAINEE' | 'TRAINER' | 'ADMIN', redirectToDashboard?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Instant optimistic profiles for 0ms transitions
const DEMO_PROFILES: Record<'TRAINEE' | 'TRAINER' | 'ADMIN', UserProfile> = {
  TRAINEE: {
    id: '663a753c-0a6c-43c1-a8b1-98dc3b6dacc9',
    name: 'Sujal Patel',
    email: 'sujal@example.com',
    role: 'TRAINEE',
    status: 'APPROVED',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sujal%20Patel',
    traineeProfile: {
      qualifications: 'B.Tech in Computer Engineering',
      careerGoal: 'AI/ML Platform Engineer',
      department: 'Computer Engineering',
      skills: 'Python, Problem Solving',
      currentLevel: 3,
      targetLevel: 5,
    },
  },
  TRAINER: {
    id: '98a6fcbd-845b-40d9-803a-3f77e79a4ac0',
    name: 'Prof. Sunit Nair',
    email: 'sunita.nair@campuspilot.ai',
    role: 'TRAINER',
    status: 'APPROVED',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    trainerProfile: {
      qualifications: 'M.Tech Computer Science & Distributed Systems',
      experience: '6 Years Cloud Solution Architect',
      expertise: 'Cloud Computing, Microservices, Kubernetes, High-Performance Web',
      rating: 4.88,
      totalTrainees: 980,
    },
  },
  ADMIN: {
    id: 'f2fa4f34-c8ee-4e22-83a4-bedef28022dd',
    name: 'Dr. Alok Nath',
    email: 'admin@campuspilot.ai',
    role: 'ADMIN',
    status: 'APPROVED',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cp_current_user');
        if (cached) return JSON.parse(cached);
        const cachedRole = localStorage.getItem('cp_demo_role') as 'TRAINEE' | 'TRAINER' | 'ADMIN' | null;
        return cachedRole ? DEMO_PROFILES[cachedRole] : DEMO_PROFILES.TRAINEE;
      } catch {
        return DEMO_PROFILES.TRAINEE;
      }
    }
    return DEMO_PROFILES.TRAINEE;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cp_current_user', JSON.stringify(data.user));
          localStorage.setItem('cp_demo_role', data.user.role);
        }
      }
    } catch (e) {
      console.error('Session sync error:', e);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string = 'password123'): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Login failed');
        return false;
      }

      const data = await res.json();
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_current_user', JSON.stringify(data.user));
        localStorage.setItem('cp_demo_role', data.user.role);
        if (data.token) {
          localStorage.setItem('cp_token', data.token);
          document.cookie = `cp_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      }

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'TRAINER') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/trainee/dashboard');
      }

      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Registration failed');
        return false;
      }

      const data = await res.json();
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_current_user', JSON.stringify(data.user));
        localStorage.setItem('cp_demo_role', data.user.role);
        if (data.token) {
          localStorage.setItem('cp_token', data.token);
          document.cookie = `cp_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      }

      if (data.user.role === 'TRAINER') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/trainee/dashboard');
      }

      return true;
    } catch (e) {
      console.error('Registration error:', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const switchRoleDemo = async (role: 'TRAINEE' | 'TRAINER' | 'ADMIN', redirectToDashboard: boolean = false) => {
    // 1. Instant 0ms Optimistic State Update
    const optimisticUser = DEMO_PROFILES[role];
    setUser(optimisticUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_current_user', JSON.stringify(optimisticUser));
      localStorage.setItem('cp_demo_role', role);
    }

    // 2. Immediate Navigation if requested
    if (redirectToDashboard) {
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'TRAINER') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/trainee/dashboard');
      }
    }

    // 3. Background session sync with PostgreSQL
    let targetEmail = 'sujal@example.com';
    let targetPass = 'password123';

    if (role === 'ADMIN') {
      targetEmail = 'admin@campuspilot.ai';
      targetPass = 'admin123';
    } else if (role === 'TRAINER') {
      targetEmail = 'sunita.nair@campuspilot.ai';
      targetPass = 'password123';
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, password: targetPass }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('cp_current_user', JSON.stringify(data.user));
            if (data.token) {
              localStorage.setItem('cp_token', data.token);
              document.cookie = `cp_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
            }
          }
        }
      })
      .catch((err) => console.error('Silent session sync error:', err));
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cp_current_user');
      localStorage.removeItem('cp_demo_role');
      localStorage.removeItem('cp_token');
      document.cookie = 'cp_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchRoleDemo,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
