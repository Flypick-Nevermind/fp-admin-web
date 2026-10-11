interface PlaceholderPageProps {
  title: string;
}

/**
 * Generic placeholder for pages not yet built.
 * Professional empty-state card.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-text">{title}</h1>
        <p className="text-sm text-muted mt-1">This section is coming soon.</p>
      </header>
      <div className="card card-hover p-10 text-center">
        <div className="mx-auto h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text mt-4">
          {title} is on the roadmap
        </p>
        <p className="text-sm text-muted mt-1">
          We'll surface the full experience here once it's ready.
        </p>
      </div>
    </div>
  );
}
