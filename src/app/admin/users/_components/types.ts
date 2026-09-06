export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  status: string;
  type?: string;
  gender?: string | null;
  hometown?: string | null;
  bio?: string | null;
  roles?: string[];
  user_auth?: {
    must_change_password?: boolean;
  };
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  user_count?: number;
}

export interface UserFilters {
  search: string;
  status: string;
  role: string;
}

export const PAGE_SIZE = 10;

export interface CreateForm {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface EditForm {
  username: string;
  first_name: string;
  last_name: string;
}
