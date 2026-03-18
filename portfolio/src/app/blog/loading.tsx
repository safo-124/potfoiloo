export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl animate-pulse">
        {/* Back link skeleton */}
        <div className="h-4 w-28 bg-muted rounded mb-8" />

        {/* Header skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="h-8 w-24 bg-muted rounded" />
          </div>
          <div className="h-4 w-80 bg-muted rounded mb-2" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>

        {/* Featured card skeleton */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 mb-12">
          <div className="h-5 w-16 bg-muted rounded-full mb-4" />
          <div className="flex gap-4 mb-4">
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
          <div className="h-8 w-3/4 bg-muted rounded mb-3" />
          <div className="h-4 w-full bg-muted rounded mb-2" />
          <div className="h-4 w-2/3 bg-muted rounded mb-6" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-14 bg-muted rounded-full" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="flex gap-3 mb-3">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
              <div className="h-6 w-3/4 bg-muted rounded mb-2" />
              <div className="h-4 w-full bg-muted rounded mb-1" />
              <div className="h-4 w-1/2 bg-muted rounded mb-4" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
