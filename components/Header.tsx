export function Header() {
  return (
    <header className="max-w-2xl mx-auto px-4 pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-glow" />
          <div className="text-xl font-bold tracking-tight">Expose</div>
        </div>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-white/70 hover:text-white"
        >
          @expose_daily
        </a>
      </div>
      <p className="text-white/60 text-sm mt-2">
        Answer the daily question to unlock the vault. Vote the wildest. Top answer gets tweeted.
      </p>
    </header>
  );
}
