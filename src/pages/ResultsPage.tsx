import { useNavigate } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Briefcase,
  Target,
  Award,
  Printer,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { gameState, resetSimulation, getOptimalDecisionsCount, scenario } = useSimulation();

  const scorePercentage = Math.round((gameState.totalPoints / gameState.maxPossiblePoints) * 100);
  const optimalCount = getOptimalDecisionsCount();
  const totalDecisions = gameState.decisions.length;

  const getGrade = () => {
    if (scorePercentage >= 90) return { grade: 'Excellent', color: 'text-feedback-positive', stars: 5 };
    if (scorePercentage >= 70) return { grade: 'Good', color: 'text-primary', stars: 4 };
    if (scorePercentage >= 50) return { grade: 'Satisfactory', color: 'text-feedback-neutral', stars: 3 };
    return { grade: 'Needs Improvement', color: 'text-feedback-negative', stars: 2 };
  };

  const { grade, color, stars } = getGrade();

  const handleReplay = () => {
    resetSimulation();
    navigate('/story');
  };

  return (
    <div className="min-h-screen hero-gradient relative py-12">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 100 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 mb-6 shadow-lg shadow-primary/10"
            >
              <Trophy className="w-12 h-12 text-primary" />
            </motion.div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Simulation Complete
            </h1>
            <p className="text-muted-foreground">
              {scenario.title} — {scenario.role}
            </p>
            
            {/* Stars */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1 mt-4"
            >
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                >
                  <Star className={cn(
                    "w-6 h-6",
                    i <= stars ? "text-decision-highlight fill-decision-highlight" : "text-border"
                  )} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Score Card */}
          <Card className="mb-8 border-2 overflow-hidden">
            <CardHeader className="text-center pb-2 bg-muted/30">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className={cn("text-7xl font-bold", color)}
                >
                  {scorePercentage}%
                </motion.span>
                <p className={cn("text-xl font-semibold mt-2", color)}>{grade}</p>
              </div>
              
              <Progress value={scorePercentage} className="h-3 mb-4" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-5 rounded-xl bg-muted border border-border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Points Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {gameState.totalPoints} / {gameState.maxPossiblePoints}
                  </p>
                </div>
                
                <div className="text-center p-5 rounded-xl bg-muted border border-border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-feedback-positive" />
                    <span className="text-sm font-medium text-muted-foreground">Optimal Decisions</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {optimalCount} / {totalDecisions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Decision Summary */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Decision Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gameState.decisions.map((decision, index) => {
                  const scene = scenario.scenes.find(s => s.id === decision.sceneId);
                  const choiceData = scene?.choices?.find(c => c.id === decision.choiceId);
                  const citedIds = decision.supportingEvidenceIds ?? [];
                  const citedEvidence = citedIds
                    .map(id => gameState.collectedEvidence.find(e => e.id === id))
                    .filter((e): e is NonNullable<typeof e> => Boolean(e));
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-xl border bg-muted/50 border-border"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground block">
                          {scene?.title || `Decision ${index + 1}`}
                        </span>
                        {choiceData && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {choiceData.text}
                          </p>
                        )}
                        {citedEvidence.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/60">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-semibold mb-1.5">
                              Evidence you cited
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {citedEvidence.map(ev => (
                                <span
                                  key={ev.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-evidence-bg border border-evidence-border text-[11px] text-foreground"
                                >
                                  {ev.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Evidence Collected */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Evidence Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You collected {gameState.collectedEvidence.length} piece{gameState.collectedEvidence.length !== 1 ? 's' : ''} of evidence during the scenario.
              </p>
              {gameState.collectedEvidence.length > 0 && (
                <div className="space-y-2">
                  {gameState.collectedEvidence.map(evidence => (
                    <div 
                      key={evidence.id}
                      className="p-4 rounded-xl bg-evidence-bg border border-evidence-border"
                    >
                      <p className="font-medium text-foreground text-sm">{evidence.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{evidence.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleReplay} className="gap-2 rounded-xl h-12 px-8">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="gap-2 rounded-xl h-12">
              <Printer className="w-4 h-4" />
              Print Certificate
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" className="rounded-xl h-12">
              Return Home
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-10">
            Completed on {gameState.completedAt ? new Date(gameState.completedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
