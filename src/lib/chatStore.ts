import { DocumentData } from "firebase/firestore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import useUserStore from "./UserStore";
type chatStore = {
  chatId: string;
  user: DocumentData | null;
  isCurrentUserBlocked: boolean;
  isReceiverUserBlocked: boolean;
  changeChat: (chatId: string, user: DocumentData) => void;
  changeBlock: () => void;
};
const useChatStore = create<chatStore>()(
  immer((set) => ({
    chatId: "",
    user: null,
    isCurrentUserBlocked: false,
    isReceiverUserBlocked: false,
    changeChat: (chatId: string, user: DocumentData) => {
      const currentUser = useUserStore.getState().user;
      if (user?.blocked.includes(currentUser?.id)) {
        set((state) => {
          state.chatId = chatId;
          state.isCurrentUserBlocked = true;
        });
      }
      if (currentUser?.blocked.includes(user?.id)) {
        set((state) => {
          state.chatId = chatId;
          state.isReceiverUserBlocked = true;
          state.user = user;
        });
      }
      set((state) => {
        state.user = user;
        state.chatId = chatId;
      });
    },
    changeBlock: () => {
      set((state) => {
        state.isReceiverUserBlocked = !state.isReceiverUserBlocked;
      });
    },
  }))
);
export default useChatStore;
