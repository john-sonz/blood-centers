import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import SplashScreen from "../components/SplashScreen";
import { User } from "../types/user";
import axios from "axios";

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

  const login = useCallback(async (pesel: string, password: string) => {
    const result = await axios.post("/auth/login", {
      pesel,
      password,
    });
    const user: User = result.data;

    dispatch({ type: "LOGIN", payload: { user } });
  }, []);
  const logout = useCallback(async () => {
    await axios.post("/auth/logout");
    dispatch({ type: "LOGOUT" });
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const result = await axios.get("/me");
        const user: User = result.data;
        dispatch({
          type: "INITIALIZE",
          payload: { isAuthenticated: true, user },
        });
      } catch (error) {
        dispatch({
          type: "INITIALIZE",
          payload: { isAuthenticated: false },
        });
      }
    }
    initialize();
  }, []);

  if (!state.isInitialized) return <SplashScreen />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
