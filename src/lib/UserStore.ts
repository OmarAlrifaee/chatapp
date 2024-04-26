import { create } from "zustand";
import { getDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";
import { immer } from "zustand/middleware/immer";
type Store = {
  user: DocumentData | null;
  isLoading: boolean;
  getUserInfo(user: User | null): void;
};

const useUserStore = create<Store>()(
  immer((set) => ({
    user: null,
    isLoading: true,
    getUserInfo: async (user: User | null) => {
      if (!user?.uid)
        set((state) => {
          state.user = null;
          state.isLoading = false;
        });
      try {
        const docRef = doc(db, "users", user?.uid as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          set((state) => {
            state.user = docSnap.data();
            state.isLoading = false;
          });
        } else {
          set((state) => {
            state.user = null;
            state.isLoading = false;
          });
        }
      } catch (err) {
        console.log(err);
        set((state) => {
          state.user = null;
          state.isLoading = false;
        });
      }
    },
  }))
);
export default useUserStore;
