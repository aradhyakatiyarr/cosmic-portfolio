import React, { useState, useEffect } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import { resumeData } from '../../data/resume';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface HUDProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  fxEnabled: boolean;
  onToggleFx: () => void;
}

export const HUD: React.FC<HUDProps> = ({ currentSection, onNavigate, fxEnabled, onToggleFx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'core', label: 'Intro' },
    { id: 'skills', label: 'Expertise' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'hobbies', label: 'Hobbies' },
    { id: 'contact', label: 'Portal' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Glassmorphic Navigation HUD */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 px-6 py-3 ${
        scrolled ? 'bg-space-deep/60 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLinkClick('core')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-space-accent to-space-cyan flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)] animate-spin-slow">
              <Compass className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-widest uppercase block font-sans">
                {resumeData.name}
              </span>
              <span className="text-[9px] text-space-cyan tracking-wider font-mono uppercase block -mt-1">
                {resumeData.title}
              </span>
            </div>
          </div>

          {/* Desktop HUD Nav Menu */}
          <nav className="hidden md:flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  currentSection === item.id
                    ? 'bg-space-accent/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-space-accent/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Fast-Links & FX Toggle Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href={resumeData.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-space-cyan hover:border-space-cyan/50 hover:bg-space-cyan/5 hover:scale-110 transition-all cursor-pointer"
              title="GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={resumeData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-space-accent hover:border-space-accent/50 hover:bg-space-accent/5 hover:scale-110 transition-all cursor-pointer"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={resumeData.hobbies.personalInsta}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-400/5 hover:scale-110 transition-all cursor-pointer"
              title="Personal Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>

            <button 
              onClick={onToggleFx} 
              className="px-2.5 py-1 ml-2 rounded-full text-[9px] font-mono border transition-all cursor-pointer border-space-cyan/30 text-space-cyan hover:border-space-cyan hover:bg-space-cyan/10 pointer-events-auto"
              title="Click to toggle bloom post-processing for better performance"
            >
              FX: {fxEnabled ? 'HIGH (BLOOM)' : 'LOW (PERF)'}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/15 text-gray-300 hover:text-white md:hidden cursor-pointer"
          >
            {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Glassmorphic Overlay Menu */}
      <div className={`fixed inset-0 z-30 flex items-center justify-center bg-space-deep/95 backdrop-blur-xl border-l border-white/10 transition-all duration-500 md:hidden ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col items-center gap-5 p-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-space-accent to-space-cyan flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-2">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <nav className="flex flex-col items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  currentSection === item.id
                    ? 'bg-space-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <button 
            onClick={onToggleFx} 
            className="px-4 py-1.5 mt-2 rounded-full text-[10px] font-mono border border-space-cyan/40 text-space-cyan hover:bg-space-cyan/10"
          >
            FX: {fxEnabled ? 'HIGH (BLOOM)' : 'LOW (PERF)'}
          </button>

          <div className="h-[1px] w-20 bg-white/10 my-3" />
          
          <div className="flex items-center gap-3">
            <a href={resumeData.githubProfile} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href={resumeData.hobbies.personalInsta} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
