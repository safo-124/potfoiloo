export default function ProjectsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl animate-pulse">
        {/* Back link */}
        <div className="h-4 w-28 bg-muted rounded mb-8" />

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="h-8 w-28 bg-muted rounded" />
          </div>
          <div className="h-4 w-72 bg-muted rounded" />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-full" />
          ))}
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Image placeholder */}
              <div className="h-48 bg-muted" />
              <div className="p-5">
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-12 bg-muted rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-2/3 bg-muted rounded mb-4" />
                <div className="flex gap-1.5 mb-4">
                  <div className="h-5 w-14 bg-muted rounded-full" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-12 bg-muted rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 flex-1 bg-muted rounded-md" />
                  <div className="h-9 flex-1 bg-muted rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
