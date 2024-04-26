import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file: File) => {
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };
  // Upload file and metadata to the object 'images/mountains.jpg'
  const date = new Date();
  const storageRef = ref(storage, `images/${date + file?.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  return new Promise((res, rej) => {
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        rej(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          res(downloadURL);
        });
      }
    );
  });
};
export default upload;
