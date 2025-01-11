import './globals.css';

export const metadata = {
  title: 'Hawala',
  description: 'A Next.js app for sending and receiving cryptocurrency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {/* Header with Logo */}
        <header className="flex items-center justify-center p-4 bg-gray-100 shadow-sm">
          <img
            src="/logo.png" // Ensure you place your logo image in the public folder
            alt="Hawala Logo"
            className="w-6 h-6 mr-2"
          />
          <h1 className="text-xl font-bold text-gray-800">Hawala</h1>
        </header>

        {/* Main Content */}
        <main className="p-4">{children}</main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-4">
          <p>&copy; {new Date().getFullYear()} Hawala</p>
        </footer>
      </body>
    </html>
  );
}
