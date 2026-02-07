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
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { gameState, resetSimulation, getOptimalDecisionsCount, scenario } = useSimulation();

  const scorePercentage = Math.round((gameState.totalPoints / gameState.maxPossiblePoints) * 100);
  const optimalCount = getOptimalDecisionsCount();
  const totalDecisions = gameState.decisions.length;

  const getGrade = () => {
    if (scorePercentage >= 90) return { grade: 'Excellent', color: 'text-feedback-positive' };
    if (scorePercentage >= 70) return { grade: 'Good', color: 'text-primary' };
    if (scorePercentage >= 50) return { grade: 'Satisfactory', color: 'text-feedback-neutral' };
    return { grade: 'Needs Improvement', color: 'text-feedback-negative' };
  };

  const { grade, color } = getGrade();

  const handleReplay = () => {
    resetSimulation();
    navigate('/story');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
            >
              <Trophy className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Simulation Complete
            </h1>
            <p className="text-muted-foreground">
              {scenario.title} - {scenario.role}
            </p>
          </div>
          
          {/* Score Card */}
          <Card className="mb-8">
            <CardHeader className="text-center pb-2">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center mb-6">
                <span className={cn("text-6xl font-bold", color)}>
                  {scorePercentage}%
                </span>
                <p className={cn("text-xl font-semibold mt-2", color)}>{grade}</p>
              </div>
              
              <Progress value={scorePercentage} className="h-3 mb-4" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Points Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {gameState.totalPoints} / {gameState.maxPossiblePoints}
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted">
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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Decision Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gameState.decisions.map((decision, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      decision.isOptimal ? "bg-feedback-positive/10" : "bg-feedback-negative/10"
                    )}
                  >
                    {decision.isOptimal ? (
                      <CheckCircle className="w-5 h-5 text-feedback-positive flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-feedback-negative flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        Decision {index + 1}
                      </span>
                      <span className={cn(
                        "ml-2 text-sm",
                        decision.isOptimal ? "text-feedback-positive" : "text-feedback-negative"
                      )}>
                        +{decision.points} points
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Evidence Collected */}
          <Card className="mb-8">
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
                      className="p-3 rounded-lg bg-evidence-bg border border-evidence-border"
                    >
                      <p className="font-medium text-foreground text-sm">{evidence.title}</p>
                      <p className="text-xs text-muted-foreground">{evidence.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleReplay} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print Certificate
            </Button>
            <Button onClick={handleHome} variant="ghost">
              Return Home
            </Button>
          </div>
          
          {/* Completion timestamp */}
          <p className="text-center text-sm text-muted-foreground mt-8">
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
