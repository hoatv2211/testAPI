import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Treatstorm - QR Voting',
  description: 'Scan to vote in Treatstorm!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
