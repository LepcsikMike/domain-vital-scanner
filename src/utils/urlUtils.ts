
export const normalizeUrl = (domain: string): { http: string; https: string } => {
  // Remove any existing protocol and clean the domain
  let cleanDomain = domain
    .replace(/^https?:\/\//, '') // Remove existing protocol
    .replace(/\/$/, '') // Remove trailing slash
    .trim();

  // Remove www. prefix for consistency
  if (cleanDomain.startsWith('www.')) {
    cleanDomain = cleanDomain.substring(4);
  }

  return {
    http: `http://${cleanDomain}`,
    https: `https://${cleanDomain}`
  };
};

export const getDomainUrl = (domain: string): string => {
  // Clean domain and default to HTTPS
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .trim();
  
  return `https://${cleanDomain}`;
};
