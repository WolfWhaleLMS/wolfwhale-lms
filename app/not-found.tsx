import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-display font-bold bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent text-glow-blue mb-2">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-lg text-white/60 mb-6">
          This page swam away! Let&apos;s get you back on course.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#00BFFF] text-white rounded-lg hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] transition-all font-medium"
          >
            Go home
          </Link>
          <Link
            href="/info"
            className="px-6 py-3 border border-white/20 text-white rounded-lg hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all font-medium"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
