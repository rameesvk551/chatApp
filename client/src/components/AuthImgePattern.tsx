interface AuthImagePatternProps {
    title: string;
    subtitle: string;
  }
  
  const AuthImagePattern: React.FC<AuthImagePatternProps> = ({ title, subtitle }) => {
    return (
      <div className="flex items-center justify-center bg-base-200 p-12"> 
        <div className="max-w-md text-center">
          {/* Skeleton Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-gray-300 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
  
          {/* Title & Subtitle */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  