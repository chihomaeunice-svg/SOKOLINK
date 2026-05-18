import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(percent);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadProductImage(
  file: File,
  sellerId: string,
  productId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `products/${sellerId}/${productId}/${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

export async function uploadSellerLogo(
  file: File,
  sellerId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `sellers/${sellerId}/logo.${ext}`;
  return uploadFile(file, path, onProgress);
}

export async function uploadIdDocument(
  file: File,
  sellerId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `sellers/${sellerId}/id-document.${ext}`;
  return uploadFile(file, path, onProgress);
}

export async function deleteFile(url: string): Promise<void> {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
}
