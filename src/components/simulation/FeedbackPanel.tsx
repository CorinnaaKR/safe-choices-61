import { motion } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Quote, Lightbulb } from 'lucide-react';

interface FeedbackPanelProps {
  choice: Choice;
  onContinue: () => void;
}

export function FeedbackPanel({ choice, onContinue }: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Consequence - narrative style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-6 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 relative overflow-hidden"
      >
        <Quote className="absolute top-3 left-3 w-6 h-6 text-white/10" />
        <p className="font-serif text-base md:text-lg text-white/85 italic leading-[1.8] pl-4">
          {choice.consequence}
        </p>
      </motion.div>
      
      {/* Reflection note — no judgment */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10"
      >
        <div className="flex items-start gap-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="p-2 rounded-lg bg-decision-highlight/10"
          >
            <Lightbulb className="w-5 h-5 text-decision-highlight" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-decision-highlight mb-1">
              Something to consider
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">{choice.feedback}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Continue Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 flex justify-center"
      >
        <Button 
          onClick={onContinue} 
          size="lg" 
          className="gap-2 px-8 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
