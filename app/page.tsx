import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <div className="landing-card">
        <div className="logo">R</div>

        <p className="eyebrow">VRCHAT MODERATION</p>

        <h1>Radon Dashboard</h1>

        <p className="muted">
          Manage your VRChat groups, moderation
          statistics and Radon data from one place.
        </p>

        <Link href="/dashboard" className="button primary">
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}