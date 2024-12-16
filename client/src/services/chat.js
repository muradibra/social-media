import axiosInstance from "./instance";

export async function getConversation({ receiverId }) {
  try {
    const resp = await axiosInstance.get(`/conversation/${receiverId}`);
    return resp.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}