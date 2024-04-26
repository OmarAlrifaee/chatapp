import { useState } from "react";
import GuestAvatar from "../../assets/avatar.png";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/uploads";
type AvatarType = {
  file: File | null;
  url: string;
};
const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<AvatarType>({
    file: null,
    url: "",
  });
  const hundleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const url = URL.createObjectURL(file as Blob);
    if (file) {
      setAvatar({
        file,
        url,
      });
    }
  };
  const hundleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      const imgUrl = await upload(avatar?.file as File);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account Created Seccessfully");
    } catch (err) {
      console.log(err);
      toast.error("Some Thing Went Wronge Please Try Agine");
    } finally {
      setLoading(false);
    }
  };
  const hundleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      toast.success("You Loged In Seccessfully");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wronge");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="item">
        <h2>Wellcome back,</h2>
        <form onSubmit={hundleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
          />
          <button disabled={loading}>
            {loading ? "loading..." : "Log In"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create An Account</h2>
        <form
          action=""
          onSubmit={hundleRegister}
        >
          <label htmlFor="file">
            <img
              src={avatar.url || GuestAvatar}
              alt=""
            />
            Upload An Image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={hundleAvatar}
          />
          <input
            type="text"
            name="username"
            placeholder="UserName"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
          />
          <button disabled={loading}>
            {loading ? "loading..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
