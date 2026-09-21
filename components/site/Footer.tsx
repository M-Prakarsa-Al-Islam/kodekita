export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-ink-soft">
        <p>KodeKita — belajar coding secara mandiri, dalam Bahasa Indonesia.</p>
        <p className="mt-1">© {new Date().getFullYear()} KodeKita.</p>
      </div>
    </footer>
  );
}
