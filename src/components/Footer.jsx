import { Link } from 'react-router-dom';

export default function Footer() {
  const helpLinks = [
    { label: 'Site Index', to: '/' },
    { label: 'iMDbPro', to: '/' },
    { label: 'Box Office Mojo', to: '/' },
    { label: 'iMDb Developer', to: '/' },
  ];

  const corpLinks = [
    { label: 'Press Room', to: '/' },
    { label: 'Advertising', to: '/' },
    { label: 'Jobs', to: '/' },
    { label: 'Conditions of Use', to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Your Ads Privacy Choices', to: '/' },
  ];

  return (
    <footer className="bg-imdb-dark border-t border-imdb-border mt-12">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        {/* Social & App */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-imdb-border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white font-medium">Follow iMDb on social</span>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(s => (
                <span key={s} className="w-8 h-8 bg-imdb-card rounded-full flex items-center justify-center text-imdb-muted hover:text-white hover:bg-imdb-hover transition-colors cursor-pointer text-xs">
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white font-medium">Get the iMDb app</span>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-imdb-card rounded text-xs text-white cursor-pointer hover:bg-imdb-hover transition-colors">Android</span>
              <span className="px-3 py-1.5 bg-imdb-card rounded text-xs text-white cursor-pointer hover:bg-imdb-hover transition-colors">iOS</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Help</h4>
            <ul className="space-y-2">
              {helpLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-imdb-muted hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Corporate</h4>
            <ul className="space-y-2">
              {corpLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-imdb-muted hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-imdb-muted">
            &copy; 1990-2026 iMDb.com, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
