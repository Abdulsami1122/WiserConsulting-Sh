'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

interface Props {
  children: React.ReactNode;
}

export default function GoogleOAuthProviderWrapper({ children }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  if (!clientId) {
    console.warn('Google Client ID not found');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
