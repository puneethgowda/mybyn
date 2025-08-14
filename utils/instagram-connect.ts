export const handleConnectInstagram = async () => {
  window.location.href = `https://www.instagram.com/oauth/authorize?force_reauth=false&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/auth/instagram/&response_type=code&scope=instagram_business_basic`;
};
