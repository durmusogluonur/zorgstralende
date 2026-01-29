'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-2xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Er ging iets mis
            </h1>
            <p className="text-gray-600 mb-8">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Pagina vernieuwen
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
