import "./details.css";
import ArrowUp from "../../assets/arrowUp.png";
import ArrowDown from "../../assets/arrowDown.png";
import Avatar from "../../assets/avatar.png";
import DownLoad from "../../assets/download.png";
import { auth, db } from "../../lib/firebase";
import { toast } from "react-toastify";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/UserStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
const Details = () => {
  const { user, changeBlock, isCurrentUserBlocked, isReceiverUserBlocked } =
    useChatStore();
  const { user: currentUser } = useUserStore();
  const hundleBlock = async () => {
    const userDocRef = doc(db, "users", currentUser?.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverUserBlocked
          ? arrayRemove(user?.id)
          : arrayUnion(user?.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="detail">
      <div className="user">
        <img
          src={isCurrentUserBlocked ? Avatar : user?.avatar || Avatar}
          alt=""
        />
        <h2>{isCurrentUserBlocked ? "" : user?.username}</h2>
        <p></p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>chat settings</span>
            <img
              src={ArrowUp}
              alt=""
            />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img
              src={ArrowDown}
              alt=""
            />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos </span>
            <img
              src={ArrowDown}
              alt=""
            />
          </div>
          <div className="photos">
            {/*
            <div className="photoItem">
               <div className="photoDetail">
                 here you can fetch the shared photos
              </div>
              <img
                src={DownLoad}
                alt=""
                className="icon"
              />
            </div>
            */}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img
              src={ArrowUp}
              alt=""
            />
          </div>
        </div>
        <button onClick={hundleBlock} className={`${isCurrentUserBlocked && "pointer-none"}`}>
          {isCurrentUserBlocked
            ? "You Are Blocked"
            : isReceiverUserBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button
          className="logout"
          onClick={() => {
            auth.signOut();
            toast.success("You Logged Out Successfully");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Details;
