import ChatList from "./chat-list/ChatList";
import "./list.css";
import UserInfo from "./user-info/UserInfo";
const List = () => {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
