/**
 * Loading Skeleton Components
 * Reusable loading states for different sections
 */

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lmsa-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - (i * 15)}%` }}
        ></div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block h-8 w-32 bg-gray-200 rounded-full mb-6"></div>
        <div className="h-16 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        <div className="space-y-3 max-w-3xl mx-auto mb-8">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
        </div>
      </div>
    </section>
  );
}

export function GridSkeleton({ cols = 3 }) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-${cols} gap-8`}>
      {Array.from({ length: cols }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
