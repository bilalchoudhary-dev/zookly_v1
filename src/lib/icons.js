export const getIconByUrl = (url) => {
  if (!url) return 'Link';
  const lowUrl = url.toLowerCase();
  
  if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) return 'Youtube';
  if (lowUrl.includes('instagram.com')) return 'Instagram';
  if (lowUrl.includes('github.com')) return 'Github';
  if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) return 'Twitter';
  if (lowUrl.includes('linkedin.com')) return 'Linkedin';
  if (lowUrl.includes('facebook.com')) return 'Facebook';
  
  return 'Globe'; // Default icon
};