import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProgressHeaderProps {
  progress: number;
  evidenceCount: number;
  onReset: () => void;
}

export function ProgressHeader({ progress, evidenceCount, onReset }: ProgressHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="w-4 h-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all your progress and collected evidence. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onReset}>Start Over</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {/* Center: Progress */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {progress}%
              </span>
            </div>
          </div>
          
          {/* Right: Evidence Count */}
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{evidenceCount}</span> evidence
          </div>
        </div>
      </div>
    </header>
  );
}
