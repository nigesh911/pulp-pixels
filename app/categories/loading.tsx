export default function Loading() {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">Categories</h1>

      {[1, 2, 3].map((index) => (
        <section key={index} className="space-y-6">
          <div className="border-b pb-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
} 