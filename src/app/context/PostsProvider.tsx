import { createContext, useContext, useState } from "react";

type PostsContextType = {
    postsState: string;
    setPostsState: (state: string) => void;
    handleFeedState: (state: string) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
    const [postsState, setPostsState] = useState<string>("Popular");

    const handleFeedState = (feedState: string) => {
        const currentFeed = localStorage.getItem('feed');
        if(currentFeed === 'Popular' && feedState === 'Popular') {
          return;
        } else if (currentFeed === 'Popular' && feedState === 'Your Feed') {
          localStorage.setItem('feed', 'Your Feed');
        } else if (currentFeed === 'Your Feed' && feedState === 'Popular') {
          localStorage.setItem('feed', 'Popular');
        } else if (currentFeed === 'Your Feed' && feedState === 'Your Feed') {
          return;
        }
    }

    return (
        <PostsContext.Provider value={{ postsState, setPostsState, handleFeedState }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) throw new Error("usePosts must be used within a PostsProvider");
    return context;
}
