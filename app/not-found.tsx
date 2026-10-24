import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-black text-rose-500">404</p>
      <h1 className="mt-2 text-base font-bold text-slate-900">
        Page not found
      </h1>
      <p className="mt-1 text-xs text-slate-500">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-5 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white active:bg-rose-600"
      >
        Back to home
      </Link>
    </div>
  );
}