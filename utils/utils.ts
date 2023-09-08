import { Comment, Post } from "@/common.types";

export const convertToBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const deletePostFromDB = async (postToDelete: Post) => {
  try {
    await fetch(`/api/post/${postToDelete._id.toString()}`, {
      method: "DELETE",
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//
export const deletePostFromDb = async (postToDelete: Post) => {
  const isConfirmed = confirm("Are you sure you want to delete this post?");

  if (isConfirmed) {
    try {
      await fetch(`/api/post/${postToDelete._id.toString()}`, {
        method: "DELETE",
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

export const deleteCommentFromDB = async (commentToDelete: Comment) => {
  try {
    await fetch(`/api/comment/${commentToDelete._id.toString()}`, {
      method: "DELETE",
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
