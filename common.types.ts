export type Post = {
  _id: string;
  creator: User;
  text: string;
  image: string;
  timePosted: string;
  likes: string[];
  comments: Comment[];
};

export type User = {
  _id: string;
  email: string;
  username: string;
  image: string;
  likedPosts: [];
};

export type Comment = {
  _id: string;
  creator: User;
  text: string;
  image: string;
  timePosted: string;
  likes: string[];
};
