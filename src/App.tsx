import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Details from "./components/details/Details";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import useUserStore from "./lib/UserStore";
import useChatStore from "./lib/chatStore";
export default function App() {
  const { user, getUserInfo, isLoading } = useUserStore();
  const { chatId } = useChatStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      getUserInfo(user);
    });
    return unSub;
  }, [getUserInfo]);
  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="container">
      {user ? (
        <>
          <List />
          {chatId && (
            <>
              <Chat />
              <Details />
            </>
          )}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}
