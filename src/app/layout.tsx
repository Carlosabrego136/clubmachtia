import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Club Machtia',
  description: 'Plataforma educativa Club Machtia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
