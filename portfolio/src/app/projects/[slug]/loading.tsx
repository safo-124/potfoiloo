export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl animate-pulse">
        {/* Back link */}
        <div className="h-4 w-28 bg-muted rounded mb-8" />

        {/* Category + Title */}
        <div className="h-5 w-20 bg-muted rounded-full mb-4" />
        <div className="h-10 w-3/4 bg-muted rounded mb-3" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded mb-6" />

        {/* Meta row */}
        <div className="flex gap-4 mb-8">
          <div className="h-3 w-28 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-10">
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
        </div>

        {/* Live preview placeholder */}
        <div className="rounded-xl border border-border overflow-hidden mb-10">
          <div className="h-10 bg-muted border-b border-border" />
          <div className="h-[400px] bg-muted/50" />
        </div>

        {/* Description */}
        <div className="space-y-3 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>

        {/* Tech stack grid */}
        <div className="h-6 w-28 bg-muted rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
