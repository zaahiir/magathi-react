import React from 'react';

const PageTitleSection = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  backgroundImage = "/src/assets/banner-1.jpg",
  className = ""
}) => {
  return (
    <section className={`relative py-24 bg-cover bg-center overflow-hidden ${className}`} 
             style={{ backgroundImage: `url('${backgroundImage}')` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          {breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {crumb.href ? (
                    <a 
                      href={crumb.href} 
                      className="hover:text-green-300 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={crumb.active ? "text-green-300 font-medium" : "text-gray-300"}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageTitleSection;







