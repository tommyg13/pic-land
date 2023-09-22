export type Image = {
  _id: string;
  comments: any[];
  likedBy: string[];
  likeClass: boolean;
  description: string;
  url: string;
  user: string;
  category: string;
  userAvatar: string;
  __v: number;
};

export type Category = {
  name: string;
  featured: boolean;
  image: string;
};

export type CategoriesProps = {
  categories: Category[];
};

export type Route = {
  path: string;
  element: React.ReactElement;
  requiresAuth: boolean;
  isAuth: boolean;
};

export type PrivateRouteProps = {
  children: React.ReactElement;
};

export type FormField = {
  name: string;
  value: string;
  placeholder: string;
  type: string;
  required: boolean;
  error: string;
};

export type Form = {
  values: FormField[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  actionTxt: string;
  disabled: boolean;
};

export type HandleErrorsFunction = (updatedFields: FormField[]) => void;

export type FormData = {
  data: Record<string, string>;
};
