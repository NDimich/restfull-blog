export interface Blog {
  title: string;
  subTitle: string;
  body: string;
  date?: Date;
  mainImage?: string;
  author?: string;
  authorInfo?: Author;
  category?: string;
  _id?: string;
}

export interface Author {
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  isAdmin?: boolean;
  photo?: string;
  about?: string;
  _id?: string;
}

export interface Category {
  name: string;
  _id?: string
}

export interface Message {
  message: string;
}
export interface AlertMessage extends Message{
  type: string;
}
