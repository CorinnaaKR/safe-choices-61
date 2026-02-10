import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

interface StoryNarrativeProps {
  paragraphs: string[];
  title: string;
}

export function StoryNarrative({ paragraphs, title }: StoryNarrativeProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Scene header with decorative elements */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-story-accent/10 text-story-accent">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Scene</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-story-text leading-tight">
          {title}
        </h2>
      </motion.div>
      
      {/* Narrative paragraphs with staggered entrance */}
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            <p
              className={`font-serif text-lg md:text-xl leading-[1.8] text-story-text ${
                index === 0 ? 'narrative-dropcap' : ''
              }`}
            >
              {paragraph}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Scene divider */}
      <div className="scene-divider">
        <MapPin className="w-4 h-4 text-muted-foreground/50" />
      </div>
    </div>
  );
}
