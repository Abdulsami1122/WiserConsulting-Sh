// src/features/auth/authService.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    role?: number; // Change from string to number to match backend
    phone?: string;
    address?: string;
    city?: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
    token?: string;
  }
  
  export interface RegisterResponse {
    success: boolean;
    message?: string;
    user?: {
      _id: string;
      name: string;
      email: string;
    };
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // ✅ Login request
 // ✅ Login request
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data: LoginResponse = await response.json();

  // Store user + token in localStorage
  if (data.user && data.token) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  }

  return data;
};

  
  // ✅ Register request
  export const registerUser = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  
    const data: RegisterResponse = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
  
    return data;
  };
  