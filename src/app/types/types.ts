
// useAuth koristi ovu klasu kako bi mogao prenesti sve funkcije i varijable
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

// klasa User, koristi klasu Profile
export interface User {
    id: string;
    username: string;
    email: string,
    token: string,
    profile: Profile;
}

// klasa Profile
export interface Profile {
    username: string,
    firstName: string | null,
    lastName: string | null,
    id: string,
}

// klasa Post
export interface Post {
    id: string,
    content: string,
    createdOn: string,
    userProfile: Profile,
    likes: number,
    dislikes: number,
    userReacted: number,
    comments: Comment[]
}

export interface Comment {
    id: string,
    content: string,
    createdOn: string,
    userProfile: Profile,
    likes: number,
    dislikes: number,
    userReacted: number
}
