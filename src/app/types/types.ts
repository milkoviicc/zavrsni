
// useAuth koristi ovu klasu kako bi mogao prenesti sve funkcije i varijable
export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    addDetails: (firstName: string, lastName: string) => Promise<void>;
    addImage: (selectedImage: File) => Promise<void>;
    logout: () => void;
    deleteAccount: () => void;
    isAuthenticated: boolean;
    fullyRegistered: boolean;
    defaultPicture: boolean;
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
    pictureUrl : string,
    followers: number,
    following: number
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
    commentCount: number,
    comments: Comment[],
    fileUrls: string[]
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

export interface Friendship {
    id: string,
    user: Profile,
    createdOn: string
}