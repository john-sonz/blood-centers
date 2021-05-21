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
  reinitialize: () => Promise<void>;
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
  reinitialize: () => Promise.resolve(),
};

const initialize = async (dispatch: React.Dispatch<Action>) => {
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
    try {
      await axios.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
    } catch (_) {}
  }, []);

  useEffect(() => {
    initialize(dispatch);
  }, []);

  const reinitialize = useCallback(() => initialize(dispatch), [dispatch]);

  if (!state.isInitialized) return <SplashScreen />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        reinitialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
