import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="p-4 sm:p-6 max-w-5xl mx-auto">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
