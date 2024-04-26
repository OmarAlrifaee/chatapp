import "./addUser.css";
import Avatar from "../../assets/avatar.png";
import {
  DocumentData,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";
import useUserStore from "../../lib/UserStore";
const AddUser = () => {
  const [user, setUser] = useState<DocumentData>();
  const { user: currentUser } = useUserStore();
  const hundleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username");
    try {
      const userRef = collection(db, "users");
      const qry = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(qry);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };
  const hundleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser?.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="addUser">
      <form onSubmit={hundleSubmit}>
        <input
          type="text"
          placeholder="UserName"
          name="username"
        />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img
              src={user?.avatar || Avatar}
              alt=""
            />
            <span>{user?.username}</span>
          </div>
          <button onClick={hundleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
