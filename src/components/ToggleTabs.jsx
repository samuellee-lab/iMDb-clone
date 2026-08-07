export default function ToggleTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-1 bg-imdb-card rounded-full p-1 w-fit">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === tab
              ? 'bg-imdb-gold text-black'
              : 'text-imdb-muted hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
