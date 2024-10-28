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