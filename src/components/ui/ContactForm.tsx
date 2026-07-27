import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Trigger stellar celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#fbbf24']
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl glass-panel-glow border border-space-cyan/30 relative pointer-events-auto">
      {/* Top ambient highlight */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-space-cyan/20 blur-xl rounded-full" />
      
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-white text-glow-cyan">Establish Connection</h3>
        <p className="text-xs text-gray-400 mt-1">Send a signal into the portal horizon</p>
      </div>

      {status === 'success' ? (
        <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-space-cyan/20 border border-space-cyan/40 text-space-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-white">Signal Transmitted!</h4>
            <p className="text-sm text-gray-400 px-4">
              Your transmission has crossed the event horizon. Aradhya will receive your ping shortly.
            </p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="cyber-button px-4 py-1.5 rounded-lg text-xs text-white cursor-pointer"
          >
            Send Another Signal
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Identity</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Commander Shepard"
              required
              disabled={status === 'submitting'}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white form-input"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Return Frequency (Email)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., name@domain.com"
              required
              disabled={status === 'submitting'}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white form-input"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transmission Content</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your project, mission, or inquiry..."
              rows={4}
              required
              disabled={status === 'submitting'}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white form-input resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full cyber-button py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Beam Transmission...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Beam Transmission
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
