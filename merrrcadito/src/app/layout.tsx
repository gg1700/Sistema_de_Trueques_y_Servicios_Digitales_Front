'use client';
import './globals.css';
import UserContextProvide from '@/Contexts/userContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#235E69] text-white min-h-screen" suppressHydrationWarning>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"></link>
        <UserContextProvide>
          {children}
        </UserContextProvide>
      </body>
    </html>
  );
}
