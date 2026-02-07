import { motion } from 'framer-motion';

interface StoryNarrativeProps {
  paragraphs: string[];
  title: string;
}

export function StoryNarrative({ paragraphs, title }: StoryNarrativeProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl md:text-3xl font-semibold text-story-text mb-8"
      >
        {title}
      </motion.h2>
      
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="font-serif text-lg md:text-xl leading-relaxed text-story-text"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
