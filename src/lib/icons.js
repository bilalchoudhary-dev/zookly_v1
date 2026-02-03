export const getIconByUrl = (url) => {
  if (!url) return 'Link';
  const lowUrl = url.toLowerCase();
  
  if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) return 'Youtube';
  if (lowUrl.includes('instagram.com')) return 'Instagram';
  if (lowUrl.includes('github.com')) return 'Github';
  if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) return 'Twitter';
  if (lowUrl.includes('linkedin.com')) return 'Linkedin';
  if (lowUrl.includes('facebook.com')) return 'Facebook';
  if (lowUrl.includes('tiktok.com')) return 'Tiktok';
  if (lowUrl.includes('whatsapp.com') || lowUrl.includes('wa.me') || lowUrl.includes('api.whatsapp.com')) return 'message-square'; 
  if (lowUrl.includes('telegram.me') || lowUrl.includes('t.me')) return 'Send';
  if (lowUrl.includes('discord.com')) return 'rss';
  if (lowUrl.includes('reddit.com')) return 'bot-message-square';
  
  return 'Globe'; // Default icon
};