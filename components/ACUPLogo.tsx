const ACUPLogo = ({ className = "w-16 h-16" }: { className?: string }) => {
  return (
    <div className={`${className} mx-auto mb-6`}>
      <div className="w-full h-full bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">ACUP</span>
      </div>
    </div>
  )
}

export default ACUPLogo
