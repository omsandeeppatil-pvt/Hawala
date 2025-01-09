// /app/layout.tsx

export const metadata = {
  title: "Crypto App",
  description: "A Next.js app for sending and receiving cryptocurrency.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", background: "#f3f3f3", textAlign: "center" }}>
          <h1>Crypto App</h1>
        </header>
        <main style={{ padding: "2rem" }}>{children}</main>
        <footer style={{ marginTop: "2rem", textAlign: "center" }}>
          <p>&copy; {new Date().getFullYear()} Crypto App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
