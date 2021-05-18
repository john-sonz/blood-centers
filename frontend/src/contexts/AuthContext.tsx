import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

import { User } from "../types/user";

interface AuthContextState {
  user?: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthContextState {
  login: (pesel: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

type Action =
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user?: User | null };
    }
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" };

function reducer(state: AuthContextState, action: Action): AuthContextState {
  switch (action.type) {
    case "INITIALIZE": {
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
      };
    }

    case "LOGIN": {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    }

    default: {
      return state;
    }
  }
}

const initialState: AuthContextState = {
  isAuthenticated: false,
  isInitialized: false,
};

const initialValue: AuthContextValue = {
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextValue>(initialValue);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async () => {
    dispatch({
      type: "LOGIN",
      payload: {
        user: {
          firstName: "XD",
          lastName: "DD",
          pesel: "107502",
        },
      },
    });
  }, []);
  const logout = useCallback(async () => {}, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    ></AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
