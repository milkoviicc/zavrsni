
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
    ignoreDefaultPic: boolean;
    setIgnoreDefaultPic: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean;
    authError: string;
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
    following: number,
    description: string | null,
    occupation: string | null
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
    replies: Reply[]
}

export interface Reply {
    commentReplyId: string,
    content: string,
    createdOn: string,
    userProfile: User,
    likes: number,
    dislikes: number,
    userReacted: number
}

export interface Friendship {
    friendRequestId: string,
    user: Profile,
    createdOn: string
}

export interface FriendshipStatus {
    userId: string,
    isFollowed: boolean,
    friendshipStatus : number
}

export interface FollowSuggestion {
    user: User,
    isFollowed: boolean;
}