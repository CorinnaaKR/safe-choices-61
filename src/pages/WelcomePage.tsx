import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { safeguardingScenario } from '@/data/scenario';
import { useSimulation } from '@/hooks/useSimulation';
import { BookOpen, Target, Play, RotateCcw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { hasSavedProgress, resetSimulation } = useSimulation();
  const hasProgress = hasSavedProgress();

  const handleStart = () => {
    navigate('/story');
  };

  const handleContinue = () => {
    navigate('/story');
  };

  const handleRestart = () => {
    resetSimulation();
    navigate('/story');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Professional Training Simulation</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Child Protection Safeguarding Simulation
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              An immersive, story-driven training experience where your decisions shape the outcome. 
              Practice recognizing signs, gathering evidence, and making critical safeguarding decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {hasProgress ? (
                <>
                  <Button size="lg" onClick={handleContinue} className="gap-2 text-lg px-8">
                    <Play className="w-5 h-5" />
                    Continue
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleRestart} className="gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Start Over
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={handleStart} className="gap-2 text-lg px-8">
                  <Play className="w-5 h-5" />
                  Begin Simulation
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Scenario Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      {safeguardingScenario.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {safeguardingScenario.description}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/50 mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Your Role</p>
                  <p className="font-semibold text-foreground">{safeguardingScenario.role}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-3">
                    {safeguardingScenario.learningObjectives.map((objective, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{objective}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Evidence Collection',
                  description: 'Gather and analyze evidence as the story unfolds',
                },
                {
                  title: 'Branching Decisions',
                  description: 'Your choices determine the outcome',
                },
                {
                  title: 'Immediate Feedback',
                  description: 'Learn best practices as you go',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Note */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            This simulation contains fictional scenarios designed for training purposes. 
            All characters and situations are illustrative. If you have real safeguarding concerns, 
            please follow your organization's procedures.
          </p>
        </div>
      </section>
    </div>
  );
}
