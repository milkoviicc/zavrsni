export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}
  
export interface User {
    id: string;
    username: string;
    // Add more user properties as needed
}

export interface LoginFormProps {
    email: string,
    password: string,
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    error: string | null;
    handleSignIn: () => void;
}