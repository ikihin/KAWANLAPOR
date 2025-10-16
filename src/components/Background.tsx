export function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Simple static pattern - no animations */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      
      {/* Static gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-black/20" />
    </div>
  );
}
