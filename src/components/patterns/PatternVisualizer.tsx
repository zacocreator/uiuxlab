'use client';
// Force rebuild: Storybook UI V2

import React, { useState } from 'react';
import { Box, Type, Image as ImageIcon, MousePointer2, Layout, List as ListIcon, Square, Monitor, Smartphone, Maximize, Code2, Component, FileText } from 'lucide-react';

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
  switch (item.type) {
    case 'image':
      return (
        <div className="w-full h-32 md:h-48 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative group">
          <ImageIcon className="size-8 text-slate-300 mb-2" />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/20 to-transparent">
             <span className="text-[10px] text-white font-medium drop-shadow-md">{item.name}</span>
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="space-y-2 w-full p-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-5/6" />
          <span className="text-[10px] font-mono text-slate-400 mt-2 block">{item.name}</span>
        </div>
      );
    case 'button':
      return (
        <div className="flex flex-col items-start gap-1">
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
            {item.name}
          </button>
        </div>
      );
    case 'input':
      return (
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[11px] font-medium text-slate-700">{item.name}</label>
          <div className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-slate-400">
            <span className="text-slate-400 text-xs mt-0.5">Placeholder...</span>
          </div>
        </div>
      );
    case 'nav':
      return (
        <div className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg">
          <div className="flex gap-4">
            <div className="w-12 h-2 bg-slate-800 rounded-full" />
            <div className="w-12 h-2 bg-slate-200 rounded-full" />
            <div className="w-12 h-2 bg-slate-200 rounded-full" />
          </div>
          <div className="size-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Layout className="size-3 text-slate-400" />
          </div>
        </div>
      );
    case 'list':
      return (
        <div className="w-full space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md border border-slate-100 bg-white">
               <div className="size-8 rounded-full bg-slate-100" />
               <div className="space-y-1 flex-1">
                 <div className="h-2 w-1/3 bg-slate-200 rounded" />
                 <div className="h-1.5 w-1/2 bg-slate-100 rounded" />
               </div>
            </div>
          ))}
          <span className="text-[10px] font-mono text-slate-400 ml-1 block">{item.name}</span>
        </div>
      );
    default:
      return (
        <div className="w-full min-h-[60px] p-4 rounded-md border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
          <span className="text-[11px] font-mono text-slate-500">{item.name}</span>
        </div>
      );
  }
};

export default function PatternVisualizer({ data }: PatternVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'code' | 'specs'>('canvas');
  
  if (!data || !data.structure) return null;

  const { structure, layout_hint, react_example } = data;

  const getLayoutClass = () => {
    switch (layout_hint) {
      case 'grid': return 'grid grid-cols-2 md:grid-cols-3 gap-6';
      case 'sidebar': return 'flex flex-col md:flex-row gap-6';
      case 'hero-split': return 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center';
      case 'stack': return 'flex flex-col gap-6';
      default: return 'flex flex-wrap gap-6';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-2">
        <button 
          type="button"
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'canvas' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <Component className="size-4" />
          Canvas
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'code' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <Code2 className="size-4" />
          Code
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'specs' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <FileText className="size-4" />
          Docs
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] flex flex-col bg-background">
        
        {/* Canvas Tab */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            {/* Storybook-like Toolbar (Mock) */}
            <div className="h-10 border-b border-border flex items-center px-4 gap-4 text-muted-foreground">
               <div className="flex items-center gap-2">
                 <button type="button" className="p-1 hover:bg-muted rounded text-primary" title="Viewport: Desktop"><Monitor className="size-4" /></button>
                 <button type="button" className="p-1 hover:bg-muted rounded" title="Viewport: Mobile"><Smartphone className="size-4" /></button>
               </div>
               <div className="w-px h-4 bg-border" />
               <div className="flex items-center gap-2 text-xs font-mono">
                  <span>100%</span>
               </div>
               <div className="flex-1" />
               <button type="button" className="p-1 hover:bg-muted rounded"><Maximize className="size-4" /></button>
            </div>
            
            {/* Canvas Area */}
            <div className="flex-1 p-8 overflow-y-auto relative bg-slate-50 flex items-center justify-center min-h-[400px]">
              {/* Dot grid background */}
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className={`w-full max-w-4xl relative bg-white border border-slate-200 rounded-xl shadow-sm p-8 ${getLayoutClass()}`}>
                {structure.map((item, idx) => (
                  <div key={idx} className={layout_hint === 'sidebar' && idx === 0 ? 'md:w-64 shrink-0' : layout_hint === 'sidebar' ? 'flex-1' : ''}>
                    <WireframeBlock item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="flex-1 bg-[#0d1117] text-slate-300 p-6 overflow-auto relative group animate-in fade-in duration-300">
             <div className="absolute right-4 top-4 text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
               {layout_hint}.tsx
             </div>
             {react_example ? (
               <pre className="font-mono text-xs leading-relaxed">
                 <code>{react_example}</code>
               </pre>
             ) : (
               <div className="h-full min-h-[300px] flex items-center justify-center text-slate-500">No code example available</div>
             )}
          </div>
        )}

        {/* Specs / Docs Tab */}
        {activeTab === 'specs' && (
          <div className="flex-1 p-8 overflow-y-auto animate-in fade-in duration-300">
             <div className="max-w-3xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-2">Pattern Documentation</h3>
                  <p className="text-muted-foreground text-sm">Layout Strategy: <code className="bg-muted px-1 py-0.5 rounded text-primary">{layout_hint}</code></p>
                </div>
                
                <div className="space-y-4">
                  {structure.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                       <div className="mt-1 p-2 bg-background border rounded-md text-muted-foreground">
                         <ComponentIcon type={item.type} className="size-5" />
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-semibold">{item.name}</h4>
                           <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                             {item.type}
                           </span>
                         </div>
                         <p className="text-sm text-muted-foreground">{item.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
