export default function WishlistPage() {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Brand indicator */}
        <div className="mb-6">
          <p className="text-xs font-light uppercase text-gray-800 tracking-[0.2em]">FactoryFinds</p>
        </div>

        {/* Main heading */}
        <h2 className="text-xs font-black text-black mb-6 uppercase tracking-[0.15em]">My Wishlist</h2>

        {/* Empty state message */}
        <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <h3 className="text-xs font-black text-black mb-3 uppercase tracking-[0.15em]">Your collection awaits</h3>
        <p className="text-xs text-gray-600 font-light mb-8 tracking-wide">
          Why put your dreams on hold by adding clothes to a wishlist and forgetting them?
        </p>

        <button className="px-6 py-3 bg-black text-white text-xs font-light uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
          Explore Collection
        </button>
      </div>
    </div>
  );
}
