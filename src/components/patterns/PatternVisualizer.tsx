'use client';

import React from 'react';
import { Box, Type, Image as ImageIcon, MousePointer2, Layout, List as ListIcon, Square } from 'lucide-react';

interface ComponentStructure {
  name: string;
  description: string;
  type: 'image' | 'text' | 'button' | 'input' | 'nav' | 'list' | 'container';
}

interface VisualizationData {
  structure: ComponentStructure[];
  layout_hint: string;
  react_example: string;
}

interface PatternVisualizerProps {
  data: VisualizationData;
}

const ComponentIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case 'image': return <ImageIcon className={className} />;
    case 'text': return <Type className={className} />;
    case 'button': return <MousePointer2 className={className} />;
    case 'nav': return <Layout className={className} />;
    case 'list': return <ListIcon className={className} />;
    case 'input': return <Square className={className} />;
    default: return <Box className={className} />;
  }
};

const WireframeBlock = ({ item }: { item: ComponentStructure }) => {
  const baseClass = "relative flex flex-col items-center justify-center rounded border-2 transition-all duration-300 group p-4 min-h-[80px]";
  
  switch (item.type) {
    case 'image':
      return (
        <div className={`${baseClass} border-blue-200 bg-blue-50/30 border-dashed overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6), linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
          </div>
          <ImageIcon className="size-6 text-blue-400 mb-1" />
          <span className="text-[10px] font-mono text-blue-500 font-bold uppercase">{item.name}</span>
        </div>
      );
    case 'text':
      return (
        <div className={`${baseClass} border-slate-200 bg-white items-start p-3`}>
          <div className="w-1/2 h-2 bg-slate-200 rounded-full mb-2" />
          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-1" />
          <div className="w-4/5 h-1.5 bg-slate-100 rounded-full" />
          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400 uppercase">{item.name}</span>
        </div>
      );
    case 'button':
      return (
        <div className={`${baseClass} border-indigo-200 bg-indigo-50/50 flex-row gap-2 h-12 min-h-0`}>
          <div className="px-4 py-1.5 bg-indigo-500 rounded text-[10px] text-white font-bold shadow-sm">
            {item.name}
          </div>
        </div>
      );
    case 'nav':
      return (
        <div className={`${baseClass} border-slate-300 bg-slate-50 flex-row justify-around py-2 min-h-0 h-10`}>
          {[1, 2, 3].map(i => <div key={i} className="w-8 h-1 bg-slate-300 rounded-full" />)}
          <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-mono text-slate-500 uppercase">{item.name}</span>
        </div>
      );
    default:
      return (
        <div className={`${baseClass} border-slate-200 bg-white`}>
          <Box className="size-5 text-slate-300 mb-1" />
          <span className="text-[10px] font-mono text-slate-400 uppercase">{item.name}</span>
        </div>
      );
  }
};

export default function PatternVisualizer({ data }: PatternVisualizerProps) {
  if (!data || !data.structure) return null;

  const { structure, layout_hint, react_example } = data;

  const getLayoutClass = () => {
    switch (layout_hint) {
      case 'grid': return 'grid grid-cols-2 md:grid-cols-3 gap-4';
      case 'sidebar': return 'flex flex-col md:flex-row gap-4';
      case 'hero-split': return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'stack': return 'flex flex-col gap-4';
      default: return 'flex flex-wrap gap-4';
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Wireframe Blueprint */}
      <section>
        <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="w-4 h-px bg-indigo-200" />
          Blueprint Preview
        </h3>
        <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-8 min-h-[350px] flex items-center justify-center relative overflow-hidden">
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className={`w-full max-w-3xl ${getLayoutClass()}`}>
            {structure.map((item, idx) => (
              <div key={idx} className={layout_hint === 'sidebar' && idx === 0 ? 'md:w-1/4' : layout_hint === 'sidebar' ? 'md:flex-1' : ''}>
                <WireframeBlock item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Component Details */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="w-4 h-px bg-slate-200" />
          Module Definitions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {structure.map((item, idx) => (
            <div key={idx} className="bg-white p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <ComponentIcon type={item.type} className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-indigo-500 font-bold">#{String(idx + 1).padStart(2, '0')}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. React Code Example */}
      {react_example && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-4 h-px bg-slate-200" />
              Implementation Shell
            </h3>
            <span className="text-[10px] font-mono text-slate-400">React / Tailwind</span>
          </div>
          <div className="bg-[#1e293b] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800 bg-slate-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">{layout_hint}.tsx</span>
            </div>
            <pre className="p-6 overflow-x-auto font-mono text-[11px] leading-relaxed text-indigo-100 selection:bg-indigo-500/30">
              <code>{react_example}</code>
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}
