import "./globals.css";

export const metadata = {
  title: "Quiz — Método OG",
  description: "Descubra seu resultado respondendo 8 perguntas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-black text-white min-h-screen flex justify-center">
        <main className="w-full max-w-xl p-4">{children}</main>
      </body>
    </html>
  );
}
