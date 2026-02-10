import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { safeguardingScenario } from '@/data/scenario';
import { useSimulation } from '@/hooks/useSimulation';
import { BookOpen, Target, Play, RotateCcw, Shield, Eye, GitBranch, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { hasSavedProgress, resetSimulation } = useSimulation();
  const hasProgress = hasSavedProgress();

  const handleStart = () => navigate('/story');
  const handleContinue = () => navigate('/story');
  const handleRestart = () => {
    resetSimulation();
    navigate('/story');
  };

  const features = [
    {
      icon: Eye,
      title: 'Evidence Collection',
      description: 'Gather and analyze messages, observations, and visual evidence as the story unfolds',
    },
    {
      icon: GitBranch,
      title: 'Branching Decisions',
      description: 'Your choices shape the narrative and determine the outcome for the child',
    },
    {
      icon: MessageCircle,
      title: 'Immediate Feedback',
      description: 'Learn best practices with expert guidance after each decision point',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 hero-gradient overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">Professional Training Simulation</span>
            </motion.div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.15]">
              Child Protection<br />
              <span className="text-primary">Safeguarding Simulation</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              An immersive, story-driven training experience where your decisions 
              shape the outcome. Practice recognizing signs, gathering evidence, 
              and making critical safeguarding decisions.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {hasProgress ? (
                <>
                  <Button size="lg" onClick={handleContinue} className="gap-2 text-lg px-10 h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                    <Play className="w-5 h-5" />
                    Continue
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleRestart} className="gap-2 rounded-xl h-14">
                    <RotateCcw className="w-5 h-5" />
                    Start Over
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={handleStart} className="gap-2 text-lg px-10 h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  <Play className="w-5 h-5" />
                  Begin Simulation
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Scenario Overview */}
      <section className="py-14 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                        {safeguardingScenario.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {safeguardingScenario.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-story-bg border border-border mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Your Role</p>
                    <p className="font-semibold text-foreground text-lg">{safeguardingScenario.role}</p>
                  </div>
                </div>
                
                <div className="bg-muted/40 px-8 py-6 border-t border-border">
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
                        transition={{ delay: 0.4 + index * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
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
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-primary/30 transition-colors duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/15 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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
