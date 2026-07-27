import React from 'react';
import { X, ExternalLink, Cpu } from 'lucide-react';
import type { Project } from '../../data/resume';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl glass-panel-glow border border-space-accent/40 animate-in fade-in zoom-in duration-300 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect lines */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-space-accent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-space-cyan to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-space-accent/20 text-space-accent border border-space-accent/30 mb-2">
              <Cpu className="w-3.5 h-3.5" /> Project Moon Active
            </span>
            <h3 className="text-2xl font-bold text-white text-glow-purple font-sans tracking-wide">
              {project.title}
            </h3>
            <p className="text-sm text-space-cyan/90 mt-1 font-sans">{project.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</h4>
            <p className="text-gray-200 leading-relaxed text-sm">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Accomplishments</h4>
            <ul className="space-y-2">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-space-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Technologies Deployed</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/15 text-gray-300 font-mono hover:border-space-cyan/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/10 bg-black/40">
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" /> Codebase
            </a>
          )}
          {project.live && (
            <a 
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
