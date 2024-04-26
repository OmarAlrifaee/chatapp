import "./userinfo.css";
import GeustAvatar from "../../../assets/avatar.png";
import More from "../../../assets/more.png";
import Video from "../../../assets/video.png";
import Edit from "../../../assets/edit.png";
import useUserStore from "../../../lib/UserStore";
const UserInfo = () => {
  const { user } = useUserStore();
  return (
    <div className="userInfo">
      <div className="user">
        <img
          src={user?.avatar || GeustAvatar}
          alt=""
        />
        <h2>{user?.username}</h2>
      </div>
      <div className="icons">
        <img
          src={More}
          alt=""
        />
        <img
          src={Video}
          alt=""
        />
        <img
          src={Edit}
          alt=""
        />
      </div>
    </div>
  );
};

export default UserInfo;
