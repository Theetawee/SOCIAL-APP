export interface HobbyType {
    id: number;
    name: string;
}

export interface UserType {
    id: number;
    username: string;
    email: string;
    phone: string | null;
    gender: string | null;
    date_of_birth: string | null;
    image: string | null;
    bio: string | null;
    verified: boolean;
    name: string;
    profile_image_hash: string;
    location: string | null;
    badges: string[];
    joined: string;
    is_self: boolean;
    account_is_friend: boolean;
    user_is_friend: boolean;
    user_sent_friend_request: boolean;
    account_sent_friend_request: boolean;
    hobbies: HobbyType[];
}

export interface FriendRequestType {
    id: number;
    sender: UserType;
    recipient: UserType;
    status: string;
    date_sent: string;
}

export interface ImageDataType {
    content_image: string;
    image_hash: string;
    id: number;
}

interface PostAccountType {
    username: string;
    id: number;
    name: string;
    image: string | null;
    profile_image_hash: string;
    verified: boolean;
}

interface BaseStructure {
    content: string;
    account: PostAccountType;
    timestamp: string;
    last_edited: string;
    total_likes: number;
    views: number;
    id: number;
    is_liked: boolean;
    is_disliked: boolean;
    post_images: ImageDataType[];
    taged_accounts: PostAccountType[];
}

export interface PostType extends BaseStructure {
    open_to: string;
    total_comments: number;
}

export interface PostResponseType {
    next: number | null;
    previous: number | null;
    count: number;
    results: PostType[];
}

export interface UserResponseType {
    next: number | null;
    previous: number | null;
    count: number;
    results: UserType[];
}

export interface PostFormDataType {
    content: string;
    account: string;
    files?: Blob[] | File[]; // Updated to handle multiple files
    open_to: string;
    taged_accounts: UserResponseType[];
}
