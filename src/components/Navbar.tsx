import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/jobber">Jobber</Link>
      <Link href="/prestasjoner">Prestasjoner</Link>
      <Link href="/grunder">Gründer</Link>
      <Link href="/profil">Profil</Link>
      <Link href="/login" className="ml-auto">Logg inn</Link>
    </nav>
  );
}