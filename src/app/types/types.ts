

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    addDetails: (firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
    deleteAccount: () => void;
    isAuthenticated: boolean;
    fullyRegistered: boolean;
    loading: boolean;
}
  
export interface User {
    id: string;
    username: string;
    email: string,
    token: string,
    profile: Profile;
}

export interface Profile {
    username: string,
    firstName: string | null,
    lastName: string | null,
    id: string,
}

export interface Post {
    id: string,
    content: string,
    createdOn: string,
    userProfile: Profile,
    likes: number,
    dislikes: number,
    userReacted: number
}


export interface LoginFormProps {
    email: string,
    password: string,
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    error: string | null;
    handleSignIn: () => void;
}