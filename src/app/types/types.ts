
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

export interface Auth {
    user: User,
    token: string
}

// klasa User
export interface User {
    userId: string;
    username: string;
    firstName: string | null,
    lastName: string | null,
    pictureUrl: string;
}

// klasa Profile
export interface Profile {
    userId: string,
    username: string,
    firstName: string | null,
    lastName: string | null,
    pictureUrl : string,
    followers: number,
    following: number
}

// klasa Post
export interface Post {
    postId: string,
    content: string,
    createdOn: string,
    user: User,
    likes: number,
    dislikes: number,
    userReacted: number,
    commentCount: number,
    fileUrls: string[]
}

export interface Comment {
    commentId: string,
    content: string,
    createdOn: string,
    user: User,
    likes: number,
    dislikes: number,
    userReacted: number,
    replies: string[]
}

export interface Friendship {
    friendRequestId: string,
    user: Profile,
    createdOn: string
}