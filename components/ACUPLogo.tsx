const ACUPLogo = ({ className = "w-20 h-20" }: { className?: string }) => {
  return (
    <div className={`${className} mx-auto mb-6`}>
      <div className="relative w-full h-full">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-red-600 flex items-center justify-center">
          {/* Inner circle with gradient */}
          <div className="w-[70%] h-[70%] bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">ACUP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ACUPLogo
