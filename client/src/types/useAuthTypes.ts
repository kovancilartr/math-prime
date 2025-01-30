type User = {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStoreState = {
  user: User | null;
  allUsersState: User[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
};

type AuthStoreActions = {
  register: (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<Boolean>;
  allUsers: () => Promise<any>;
  editUser: (data: {
    id: string | undefined;
    newName: string;
    newSurname: string;
    newEmail: string;
    newPassword?: string;
    newRole: string;
    newStatus: string;
  }) => Promise<any>;
  deleteUser: (ids: string[]) => Promise<any>;
};

export type AuthStore = AuthStoreState & AuthStoreActions;
