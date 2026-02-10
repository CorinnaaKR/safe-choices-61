import { motion } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackPanelProps {
  choice: Choice;
  onContinue: () => void;
}

export function FeedbackPanel({ choice, onContinue }: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Consequence - narrative style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-8 rounded-2xl bg-story-bg/80 border border-border relative overflow-hidden"
      >
        <Quote className="absolute top-4 left-4 w-8 h-8 text-story-accent/15" />
        <p className="font-serif text-lg md:text-xl text-story-text italic leading-[1.8] pl-6">
          {choice.consequence}
        </p>
      </motion.div>
      
      {/* Feedback card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "p-6 rounded-2xl border-2 relative overflow-hidden",
          choice.isOptimal 
            ? "bg-feedback-positive/5 border-feedback-positive/30" 
            : "bg-feedback-negative/5 border-feedback-negative/30"
        )}
      >
        {/* Decorative gradient */}
        <div className={cn(
          "absolute inset-0 opacity-5",
          choice.isOptimal
            ? "bg-gradient-to-br from-feedback-positive to-transparent"
            : "bg-gradient-to-br from-feedback-negative to-transparent"
        )} />
        
        <div className="flex items-start gap-4 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className={cn(
              "p-3 rounded-xl",
              choice.isOptimal ? "bg-feedback-positive/10" : "bg-feedback-negative/10"
            )}
          >
            {choice.isOptimal ? (
              <CheckCircle className="w-7 h-7 text-feedback-positive" />
            ) : (
              <XCircle className="w-7 h-7 text-feedback-negative" />
            )}
          </motion.div>
          
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-lg mb-2",
              choice.isOptimal ? "text-feedback-positive" : "text-feedback-negative"
            )}>
              {choice.isOptimal ? "Good Decision" : "Room for Improvement"}
            </h3>
            <p className="text-foreground leading-relaxed">{choice.feedback}</p>
            
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="font-medium text-muted-foreground">Points earned:</span>
              <span className={cn(
                "font-bold text-lg",
                choice.points > 10 ? "text-feedback-positive" : 
                choice.points > 0 ? "text-feedback-neutral" : "text-feedback-negative"
              )}>
                +{choice.points}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Continue Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 flex justify-center"
      >
        <Button 
          onClick={onContinue} 
          size="lg" 
          className="gap-2 px-8 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
        >
          Continue the Story
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
