import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Pagina niet gevonden
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 inline-block text-center"
          >
            Terug naar Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-all duration-300 inline-block text-center"
          >
            Neem Contact Op
          </Link>
        </div>
      </div>
    </div>
  );
}
