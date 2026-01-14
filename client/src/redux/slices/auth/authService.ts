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
  
  // ✅ Test backend connection
  const testConnection = async (): Promise<boolean> => {
    try {
      const baseUrl = API_URL.replace('/api', '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  };

  // ✅ Login request
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to server. Please check if the backend is running on port 5000.');
    }

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const responseData = await response.json();

    // Backend returns: { success: true, message: "...", data: { user: {...}, token: "..." } }
    const user = responseData.data?.user || responseData.user;
    const token = responseData.data?.token || responseData.token;

    // Store user + token in localStorage
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }

    // Return in expected format
    return {
      success: responseData.success || true,
      message: responseData.message,
      user,
      token
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running on port 5000.');
    }
    throw error;
  }
};

  
  // ✅ Register request
  export const registerUser = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
    
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || "Registration failed");
      }

      const data: RegisterResponse = await res.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  };

  // ✅ Google OAuth login
  export interface GoogleLoginResponse {
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
  }

  export const googleLogin = async (accessToken: string): Promise<GoogleLoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const responseData = await response.json();

      // Backend returns: { success: true, message: "...", data: { user: {...}, token: "..." } }
      const user = responseData.data?.user || responseData.user;
      const token = responseData.data?.token || responseData.token;

      // Store user + token in localStorage
      if (user && token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }

      // Return in expected format
      return {
        success: responseData.success || true,
        message: responseData.message,
        user,
        token
      };
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  };
  