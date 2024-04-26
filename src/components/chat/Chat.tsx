import "./chat.css";
import IMG from "../../assets/img.png";
import Camira from "../../assets/camera.png";
import Mic from "../../assets/mic.png";
import Phone from "../../assets/phone.png";
import Video from "../../assets/video.png";
import Info from "../../assets/info.png";
import Avatar from "../../assets/avatar.png";
import Emoji from "../../assets/emoji.png";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import {
  DocumentData,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/UserStore";
const Chat = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [chat, setChat] = useState<DocumentData>();
  const { chatId, user, isCurrentUserBlocked, isReceiverUserBlocked } =
    useChatStore();
  const { user: currentUser } = useUserStore();
  const endRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    // to scroll to the current
    endRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return unSub;
  }, [chatId]);
  const hundleEmoji = (e: EmojiClickData) => {
    setText((prev) => `${prev}${e.emoji}`);
    setOpen(false);
  };
  const hundleSend = async () => {
    const messageText = text;
    setText("");
    endRef.current.scrollIntoView({ behavior: "smooth" });
    if (!messageText) return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser?.id,
          text: messageText,
          createdAt: new Date(),
        }),
      });

      const userIds = [currentUser?.id, user?.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData?.chats?.findIndex(
            (item: DocumentData) => item?.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = messageText;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser?.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatRef, { chats: userChatsData?.chats });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img
            src={isCurrentUserBlocked ? Avatar : user?.avatar || Avatar}
            alt=""
          />
          <div className="texts">
            <span>{isCurrentUserBlocked ? "" : user?.username}</span>
            <p>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
        <div className="icons">
          <img
            src={Phone}
            alt=""
          />
          <img
            src={Video}
            alt=""
          />
          <img
            src={Info}
            alt=""
          />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message: DocumentData) => (
          <div
            className={`message ${
              message?.senderId === currentUser?.id && "own"
            }`}
            key={message?.createdAt}
          >
            <img
              src={
                message?.senderId === currentUser?.id
                  ? currentUser?.avatar
                  : isCurrentUserBlocked
                  ? Avatar
                  : user?.avatar || Avatar
              }
              alt=""
            />
            <div className="texts">
              {message?.img && <img src={message?.img} />}
              <p>{message?.text}</p>
              {/* <span>{message?.createdAt}</span> ---------------------------------->*/}
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div
        className={`bottom ${
          (isCurrentUserBlocked || isReceiverUserBlocked) && "pointer-none"
        }`}
      >
        <div className="icons">
          <img
            src={IMG}
            alt=""
          />
          <img
            src={Camira}
            alt=""
          />
          <img
            src={Mic}
            alt=""
          />
        </div>
        <input
          type="text"
          placeholder="Type A Massege"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src={Emoji}
            alt=""
            onClick={() => setOpen((prevState) => !prevState)}
          />
          <div className="picker">
            <EmojiPicker
              open={open}
              onEmojiClick={hundleEmoji}
            />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={hundleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
