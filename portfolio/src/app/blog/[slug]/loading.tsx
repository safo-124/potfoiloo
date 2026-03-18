export default function BlogPostLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl animate-pulse">
        {/* Back link */}
        <div className="h-4 w-28 bg-muted rounded mb-8" />

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-6 w-14 bg-muted rounded-full" />
        </div>

        {/* Title */}
        <div className="h-10 w-full bg-muted rounded mb-2" />
        <div className="h-10 w-2/3 bg-muted rounded mb-4" />

        {/* Meta */}
        <div className="flex gap-4 mb-8">
          <div className="h-3 w-28 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>

        <div className="h-px bg-border mb-8" />

        {/* Content lines */}
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-muted rounded"
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
          <div className="h-6 w-1/3 bg-muted rounded mt-6" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`b-${i}`}
              className="h-4 bg-muted rounded"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
