interface PlaceholderPageProps {
  title: string;
}

/**
 * Generic placeholder for pages not yet built.
 * Duolingo-style hero card.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-duo-text">{title}</h1>
      <div className="duo-card p-10 text-center">
        <p className="text-lg font-extrabold text-duo-muted">
          {title} — coming soon
        </p>
        <button className="duo-btn-primary mt-6 px-8 py-3 text-base">
          Add to your queue
        </button>
      </div>
    </div>
  );
}
