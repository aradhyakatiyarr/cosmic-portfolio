import { useState } from 'react';
import { Scene } from './components/canvas/Scene';
import { HUD } from './components/ui/HUD';
import { ProjectModal } from './components/ui/ProjectModal';
import { resumeData } from './data/resume';
import type { Project } from './data/resume';
import { ChevronDown, MapPin, Mail, Phone, Cpu, Calendar, Send } from 'lucide-react';

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);


const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('core');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fxEnabled, setFxEnabled] = useState(false);

  const handleSidebarScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPosition = target.scrollTop;
    const height = target.clientHeight;
    
    // Fractional scroll progress (0.0 to 6.0)
    const progress = scrollPosition / Math.max(1, height);
    setScrollProgress(progress);

    const index = Math.max(0, Math.min(6, Math.round(progress)));
    const sections = ['core', 'skills', 'projects', 'experience', 'education', 'hobbies', 'contact'];
    if (sections[index] && sections[index] !== currentSection) {
      setCurrentSection(sections[index]);
    }
  };

  const handleNavigate = (sectionId: string) => {
    const sections = ['core', 'skills', 'projects', 'experience', 'education', 'hobbies', 'contact'];
    const index = sections.indexOf(sectionId);
    const sidebar = document.getElementById('sidebar-scroll-container');
    if (sidebar && index !== -1) {
      sidebar.scrollTo({
        top: index * sidebar.clientHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-space-deep text-white select-none overflow-hidden">
      {/* 3D WebGL Canvas fixed in background (shifted right on desktop to align with sidebar) */}
      <Scene 
        scrollProgress={scrollProgress} 
        onSelectProject={setSelectedProject}
        fxEnabled={fxEnabled}
      />

      {/* Floating heads-up navigation */}
      <HUD 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
        fxEnabled={fxEnabled}
        onToggleFx={() => setFxEnabled(!fxEnabled)}
      />

      {/* Left-Aligned Scrollable Sidebar Dashboard */}
      <div 
        id="sidebar-scroll-container"
        onScroll={handleSidebarScroll}
        className="fixed left-0 top-0 h-screen w-full lg:w-[460px] z-30 bg-transparent lg:bg-space-deep/85 backdrop-blur-none lg:backdrop-blur-xl lg:border-r border-white/10 overflow-y-auto scroll-smooth pointer-events-auto flex flex-col lg:shadow-[10px_0_30px_rgba(0,0,0,0.8)] snap-y snap-mandatory"
      >
        
        {/* Section 0: The Core (Hero) */}
        <section id="sidebar-core" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 relative border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-6 my-auto pt-16">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans text-glow-gold uppercase">
                {resumeData.name}
              </h1>
              <p className="text-sm md:text-base font-medium tracking-wide text-space-cyan uppercase font-mono">
                {resumeData.title}
              </p>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider -mt-1 uppercase">
                {resumeData.subtitle}
              </p>
            </div>

            <p className="text-sm lg:text-xs text-gray-300 leading-relaxed font-sans">
              {resumeData.summary}
            </p>
            
            <div className="space-y-2.5 pt-4 border-t border-white/5 font-mono text-xs lg:text-[10px] text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-space-cyan" />
                <span>{resumeData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-space-gold" />
                <a href={`mailto:${resumeData.email}`} className="hover:text-white transition-colors">{resumeData.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-space-accent" />
                <a href="tel:+918318723585" className="hover:text-white transition-colors">{resumeData.phone}</a>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
            <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Scroll System</span>
            <ChevronDown className="w-4 h-4 text-space-cyan" />
          </div>
        </section>

        {/* Section 1: Orbit of Expertise (Skills) */}
        <section id="sidebar-skills" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-5 my-auto">
            <div className="space-y-1">
              <span className="text-xs lg:text-[11px] font-mono text-space-accent tracking-widest uppercase">
                LAYER I
              </span>
              <h2 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide">
                Technical Core
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[30vh] lg:max-h-[60vh] overflow-y-auto pr-1">
              {resumeData.skills.map((group) => (
                <div key={group.category} className="space-y-1.5 p-3 bg-white/5 rounded-xl border border-white/5">
                  <h3 className="text-xs lg:text-[10px] font-bold text-space-cyan uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-white/5 pb-1">
                    <Cpu className="w-3 h-3" /> {group.category}
                  </h3>
                  <div className="space-y-1">
                    {group.skills.map((skill) => (
                      <div key={skill.name} className="flex justify-between items-center text-xs lg:text-[10px]">
                        <span className="text-gray-300 font-sans">{skill.name}</span>
                        <span className="text-[10px] lg:text-[9px] font-mono text-space-accent font-semibold">{skill.level}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Work Clusters (Projects) */}
        <section id="sidebar-projects" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-5 my-auto">
            <div className="space-y-1">
              <span className="text-xs lg:text-[11px] font-mono text-space-cyan tracking-widest uppercase">
                MATRIX II
              </span>
              <h2 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide">
                Featured Systems
              </h2>
            </div>
            
            <div className="space-y-2.5 max-h-[30vh] lg:max-h-[60vh] overflow-y-auto pr-1">
              {resumeData.projects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-space-cyan/40 hover:bg-space-cyan/5 transition-all cursor-pointer group flex justify-between items-center gap-3"
                >
                  <div className="space-y-0.5">
                    <h3 className="text-sm lg:text-xs font-bold text-white font-sans group-hover:text-space-cyan transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[10px] lg:text-[9px] text-gray-400 font-mono line-clamp-1">
                      {project.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] lg:text-[9px] font-mono px-2 py-0.5 rounded bg-space-cyan/15 text-space-cyan border border-space-cyan/30 shrink-0">
                    Inspect
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Professional Experience */}
        <section id="sidebar-experience" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-5 my-auto">
            <div className="space-y-1">
              <span className="text-xs lg:text-[11px] font-mono text-pink-400 tracking-widest uppercase">
                OPTIMIZER III
              </span>
              <h2 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide">
                Experience
              </h2>
            </div>
            
            <div className="relative pl-5 border-l border-white/10 space-y-5 max-h-[30vh] lg:max-h-[60vh] overflow-y-auto pr-1">
              {resumeData.experience.map((event) => (
                <div key={event.id} className="relative space-y-1">
                  <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-pink-500 border border-white/20 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <h3 className="text-sm lg:text-xs font-bold text-white font-sans">{event.title}</h3>
                    <span className="text-[10px] lg:text-[8px] font-mono text-pink-400 font-semibold flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" /> {event.date}
                    </span>
                  </div>
                  
                  <p className="text-xs lg:text-[10px] text-space-cyan font-mono">{event.subtitle}</p>
                  
                  <ul className="space-y-0.5 text-xs lg:text-[10px] text-gray-300 font-sans list-disc list-inside pl-0.5">
                    {event.description.map((desc, idx) => (
                      <li key={idx} className="leading-normal">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Academic Foundations (Education) */}
        <section id="sidebar-education" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-5 my-auto">
            <div className="space-y-1">
              <span className="text-xs lg:text-[11px] font-mono text-space-gold tracking-widest uppercase">
                CLASSIFIER IV
              </span>
              <h2 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide">
                Education
              </h2>
            </div>
            
            <div className="relative pl-5 border-l border-white/10 space-y-5 max-h-[30vh] lg:max-h-[60vh] overflow-y-auto pr-1">
              {resumeData.education.map((event) => (
                <div key={event.id} className="relative space-y-1">
                  <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-space-gold border border-white/20 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <h3 className="text-sm lg:text-xs font-bold text-white font-sans">{event.title}</h3>
                    <span className="text-[10px] lg:text-[8px] font-mono text-space-gold font-semibold flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" /> {event.date}
                    </span>
                  </div>
                  
                  <p className="text-xs lg:text-[10px] text-space-cyan font-mono">{event.subtitle}</p>
                  
                  <ul className="space-y-0.5 text-xs lg:text-[10px] text-gray-300 font-sans list-disc list-inside pl-0.5">
                    {event.description.map((desc, idx) => (
                      <li key={idx} className="leading-normal">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Horizon Expansion (Hobbies) */}
        <section id="sidebar-hobbies" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 border-b border-white/5 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-5 my-auto">
            <div className="space-y-1">
              <span className="text-xs lg:text-[11px] font-mono text-space-gold tracking-widest uppercase">
                ATTRACTOR V
              </span>
              <h2 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide">
                Hobbies & Travel
              </h2>
            </div>
            
            <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  🌍 {resumeData.hobbies.title}
                </h3>
                <p className="text-sm lg:text-xs text-gray-300 leading-relaxed font-sans">
                  {resumeData.hobbies.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/5">
                <a 
                  href={resumeData.hobbies.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:scale-[1.02] transition-all text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4" /> Instagram (Travel Vlog)
                  </span>
                  <span className="text-[10px] lg:text-[9px] px-2 py-0.5 bg-pink-500/20 rounded">Visit</span>
                </a>

                <a 
                  href={resumeData.hobbies.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-[1.02] transition-all text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <YoutubeIcon className="w-4 h-4" /> YouTube Channel
                  </span>
                  <span className="text-[10px] lg:text-[9px] px-2 py-0.5 bg-red-500/20 rounded">Visit</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: The Portal (Contact Form) */}
        <section id="sidebar-contact" className="h-screen w-full shrink-0 flex flex-col justify-center py-10 lg:py-0 px-4 md:px-10 snap-start">
          <div className="w-full max-w-md mx-auto lg:mx-0 p-6 lg:p-0 rounded-2xl lg:rounded-none bg-black/45 lg:bg-transparent border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:shadow-none space-y-4 my-auto">
            <div className="space-y-1.5 text-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs lg:text-[11px] font-mono font-semibold bg-space-cyan/20 text-space-cyan border border-space-cyan/30">
                🌀 AUTOENCODER VI
              </span>
              <h3 className="text-2xl lg:text-xl font-bold text-white uppercase tracking-wide text-glow-cyan mt-1">
                Establish Connection
              </h3>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                import('canvas-confetti').then((conf) => {
                  conf.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#8b5cf6', '#06b6d4', '#fbbf24']
                  });
                });
                alert("Signal Beamed successfully!");
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[10px] lg:text-[9px] font-mono text-gray-400 uppercase font-semibold">IDENTITY NAME</label>
                <input type="text" placeholder="e.g. Commander Shepard" required className="w-full px-3 py-2.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg text-xs lg:text-[11px] text-white form-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] lg:text-[9px] font-mono text-gray-400 uppercase font-semibold">RETURN EMAIL</label>
                <input type="email" placeholder="name@domain.com" required className="w-full px-3 py-2.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg text-xs lg:text-[11px] text-white form-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] lg:text-[9px] font-mono text-gray-400 uppercase font-semibold">MESSAGE CONTENT</label>
                <textarea placeholder="Write transmission content..." rows={3} required className="w-full px-3 py-2.5 lg:py-2 bg-white/5 border border-white/10 rounded-lg text-xs lg:text-[11px] text-white form-input resize-none" />
              </div>
              <button type="submit" className="w-full cyber-button py-3 lg:py-2.5 rounded-lg text-sm lg:text-xs font-mono font-semibold text-white flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> BEAM SIGNAL TRANSMISSION
              </button>
            </form>
            
            <div className="flex flex-col items-center gap-1 pt-3 border-t border-white/5 text-[10px] lg:text-[9px] font-mono text-gray-400">
              <a href={`mailto:${resumeData.email}`} className="flex items-center gap-1 hover:text-white transition-colors">
                <Mail className="w-3 h-3 text-space-cyan" /> {resumeData.email}
              </a>
              <a href="tel:+918318723585" className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3 h-3 text-space-gold" /> {resumeData.phone}
              </a>
              <a href={resumeData.hobbies.personalInsta} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-pink-400 hover:text-white transition-colors">
                <InstagramIcon className="w-3 h-3" /> @aradhyaakatiyar
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* Pop-up Project Detail Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* Global Background Ambient Vignette Grid overlay */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-40" />
    </div>
  );
}

export default App;
