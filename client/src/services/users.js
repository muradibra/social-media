import axiosInstance from "./instance";

export async function searchUsers({ pageParam, search = "" }) {
  try {
    const response = await axiosInstance.get(`/user?page=${pageParam}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getFriends() {
  try {
    const resp = await axiosInstance.get(`/user/friends`
    );
    return resp.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getConversations() {
  try {
    const resp = await axiosInstance.get(`/conversation`
    );
    return resp.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function editUser(formData) {
  try {
    const resp = await axiosInstance.patch(`/user`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(resp.data);
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}