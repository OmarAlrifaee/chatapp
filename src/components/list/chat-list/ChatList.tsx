import "./chatList.css";
import Search from "../../../assets/search.png";
import Plus from "../../../assets/plus.png";
import Minus from "../../../assets/minus.png";
import Avatar from "../../../assets/avatar.png";
import { useEffect, useState } from "react";
import AddUser from "../../add-user/AddUser";
import useUserStore from "../../../lib/UserStore";
import {
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";
const ChatList = () => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [chats, setChats] = useState<DocumentData[]>([]);
  const [search, setSearch] = useState<string>("");
  const { user: currentUser } = useUserStore();
  const { changeChat } = useChatStore();
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser?.id),
      async (res) => {
        const items = res.data()?.chats;
        const promises = items?.map(async (item: DocumentData) => {
          const userDocRef = doc(db, "users", item?.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        const sortedChats = chatData?.sort(
          (first, second) => second?.updatedAt - first?.updatedAt
        );
        setChats(sortedChats);
      }
    );
    return unSub;
  }, [currentUser?.id]);
  const hundleSelect = async (chat: DocumentData) => {
    const userChats = chats?.map((chat) => {
      const { user, ...rest } = chat;
      return rest;
    });
    const chatIndex = userChats?.findIndex(
      (item) => item?.chatId === chat?.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, "userchats", currentUser?.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
    } catch (err) {
      console.log(err);
    }
    changeChat(chat?.chatId, chat?.user);
  };
  const filteredChats = chats.filter((chat) =>
    chat?.user?.username?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img
            src={Search}
            alt=""
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <img
          src={addMode ? Minus : Plus}
          alt=""
          className="add"
          onClick={() => setAddMode((prevState) => !prevState)}
        />
      </div>
      {filteredChats?.map((chat) => (
        <div
          className="item"
          key={chat?.chatId}
          onClick={() => hundleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img
            src={
              chat?.user?.blocked.includes(currentUser?.id)
                ? Avatar
                : chat?.user?.avatar || Avatar
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat?.user?.blocked.includes(currentUser?.id)
                ? "You Are Blocked"
                : chat?.user?.username}
            </span>
            <p>
              {chat?.user?.blocked?.includes(currentUser?.id)
                ? ""
                : chat?.lastMessage}
            </p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
