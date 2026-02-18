export interface Iregister {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export interface ILike {
  userId: number;
  threadId: number;
}

export type authMidlleware = {
  id: string;
};

const enum Estatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface IProfile {
  bio?: string;
  avatar?: string;
  cover?: string;
  userId?: number;
  username?: string;
  fullname?: string;
}

export interface Ithread {
  id?: number;
  content?: string;
  userId: number;
  threadId: number;
  image: IImage[];
}

export interface IEditProfile {
  bio?: string;
  avatar: File | null
  cover: File | null
  username?: string;
  fullname?: string;
}

export interface IImage {
  id?: number;
  image: string;
  threadId: number;
}

export interface IUser {
  id: number;
  username: string;
  fullname: string;
  email: string;
}

export interface ILoginResult {
  token: string;
  user: IUser;
  // profile: IProfile | null;
}

export interface ILoginResponse {
  status: boolean;
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

export interface IRegisterResponse {
  status: boolean;
  message: string;
  data: {
    user: IUser;
  profile: IProfile;
  };
}

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface Ilogin {
  email: string;
  password: string;
}

export interface Ifollow {
  followerId: number;
  followingId: number;
}
