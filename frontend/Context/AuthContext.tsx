import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// ✅ Define user type
type User = {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic?: string;
};

// ✅ Define context shape
type AuthContextType = {
  axios: typeof axios;
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  loading: boolean;
  login: (state: string, credentials: any) => Promise<void>;
  logout: (showToast?: boolean) => Promise<void>;
  updateProfile: (body: any) => Promise<void>;
};

// ✅ Default context
export const AuthContext = createContext<AuthContextType>({
  axios,
  authUser: null,
  onlineUsers: [],
  socket: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Set axios auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ✅ Check if token is valid
  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/v1/check");
      if (response.data?.success) {
        setAuthUser(response.data.user);
        connectSocket(response.data.user);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await logout(false); // token expired
      } else {
        toast.error("Could not verify session.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (state: string, credentials: any) => {
    try {
      const { data } = await axios.post(`/api/v1/${state}`, credentials);
      if (data?.success) {
        setAuthUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Login successful");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  // ✅ Logout
  const logout = async (showToast: boolean = true) => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      socket?.disconnect();
      if (showToast) toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout error");
    }
  };

  // ✅ Update Profile
  const updateProfile = async (body: any) => {
  try {
    const { data } = await axios.put("/api/v1/update-profile", body);

    const user = data.user || data.data; // ✅ fallback to correct key

    if (data.success && user) {
      setAuthUser(user);
      toast.success("Profile updated successfully");
      navigate("/");
    } else {
      toast.error("Invalid response from server.");
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Update failed");
  }
};



  // ✅ Setup socket
  const connectSocket = (userData: User) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  };

  // ✅ Run auth check on mount
  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ✅ Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo<AuthContextType>(
    () => ({
      axios,
      authUser,
      onlineUsers,
      socket,
      loading,
      login,
      logout,
      updateProfile,
    }),
    [authUser, onlineUsers, socket, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
