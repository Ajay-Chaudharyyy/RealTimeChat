import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

// Types
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  image?: string;
  seen?: boolean;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface ChatContextType {
  users: User[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedUser: User | null;
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setSelectedUser: (user: User | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (
    messageData: { text: string } | { image: string | ArrayBuffer | null }
  ) => Promise<void>;
  bio: string | undefined;
  setBio: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const {authUser} = useContext(AuthContext);
  const [bio,setBio]=useState(authUser?.bio);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({});

  const selectedUserRef = useRef<User | null>(null);
  const { socket, axios } = useContext(AuthContext);

  // Keep ref in sync
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Fetch users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/users");
      if (Array.isArray(data.users)) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error("Unexpected user format from server");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error fetching users");
    }
  };

  // Fetch messages with a user
  const getMessages = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/v1/users/${userId}`);
      if (Array.isArray(data.data)) {
        setMessages(data.data);
      } else {
        toast.error("Unexpected message format");
        setMessages([]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch messages");
      setMessages([]);
    }
  };

  // Send message (text or image)
  const sendMessage = async (
    messageData: { text: string } | { image: string | ArrayBuffer | null }
  ) => {
    try {
      if (!selectedUser) return;
      const { data } = await axios.post(`/api/v1/users/send/${selectedUser._id}`, messageData);
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
      } else {
        toast.error("Failed to send message");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error sending message");
    }
  };

  // Real-time updates
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      const currentSelected = selectedUserRef.current;

      if (currentSelected && newMessage.senderId === currentSelected._id) {
        setMessages((prev) => [...prev, { ...newMessage, seen: true }]);
        axios.put(`/api/v1/users/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return unsubscribeFromMessages;
  }, [socket]);

  const value = useMemo(() => {
    return {
      users,
      messages,
      setMessages,
      selectedUser,
      unseenMessages,
      setUnseenMessages,
      setSelectedUser,
      getUsers,
      getMessages,
      sendMessage,
      bio,
      setBio
    };
  }, [users, messages, selectedUser, unseenMessages]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
