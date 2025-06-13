

export default function RadialLoader() {
    return (
        <div className="flex items-center justify-center relative top-1/4 ">
            <div className="relative w-16 h-16 ">
                {/* Create 12 bars arranged in a circle */}
                {Array.from({ length: 12 }).map((_, index) => (
                    <div
                        key={index}
                        className="absolute w-1 h-4 bg-gray-600 rounded-full"
                        style={{
                            top: `6px`,
                            left: "50%",
                            transformOrigin: "50% 26px",
                            transform: `translateX(-50%) rotate(${index * 30}deg)`,
                            opacity: 1 - index * 0.08,
                            animation: `fade 1.2s linear infinite`,
                            animationDelay: `${index * 0.1}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}
