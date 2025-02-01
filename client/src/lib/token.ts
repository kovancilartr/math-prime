import { decodeJwt } from "jose";

export const getAccessToken = () => {
  const token = localStorage.getItem("auth-storage");

  if (token) {
    const data = JSON.parse(token);
    if (data && data.state && typeof data.state.accessToken === "string") {
      //   console.log("Access Token:", data.state.accessToken); // Hata ayıklama için
      const payload = decodeJwt(data.state.accessToken);
      return {
        success: true,
        userState: payload,
      };
    } else {
      return {
        success: false,
        error: "Local storage kullanıcı verisi yok veya geçersiz",
      };
    }
  }
  return null;
};
