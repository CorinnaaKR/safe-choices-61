import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrainingProfile } from '@/types/simulation';

interface TrainingGateProps {
  scenarioTitle: string;
  onComplete: (profile: TrainingProfile) => void;
}

const PRIOR_TRAINING_OPTIONS = [
  'Prevent Awareness e-learning (HM Government)',
  'Safeguarding Children Level 1',
  'Safeguarding Children Level 2',
  'Safeguarding Adults Level 1',
  'Safeguarding Adults Level 2',
  'Basic Awareness — Safeguarding (general)',
  'Other relevant safeguarding training',
];

export function TrainingGate({ scenarioTitle, onComplete }: TrainingGateProps) {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [priorTraining, setPriorTraining] = useState('');
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const valid = name.trim().length > 1 && organisation.trim().length > 1 && priorTraining && declared;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitted(true);
    setTimeout(() => {
      onComplete({
        name: name.trim(),
        organisation: organisation.trim(),
        priorTraining,
        declaredAt: new Date().toISOString(),
      });
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: submitted ? 0 : 1, y: submitted ? -8 : 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full"
      >
        {/* Header */}
        <div className="mb-10">
          <p className="page-label mb-3">Training mode</p>
          <h1 className="font-sans text-3xl font-bold text-foreground mb-3 tracking-tight leading-tight">
            Before you begin
          </h1>
          <div className="warm-divider mb-5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            This simulation is designed to complement formal safeguarding and Prevent training,
            not replace it. Please confirm your details and prior learning before continuing.
          </p>
        </div>

        <div className="space-y-3">

          {/* Name */}
          <div className="content-card overflow-hidden">
            <label htmlFor="gate-name" className="block px-5 pt-4 pb-1 text-xs font-medium text-muted-foreground">
              Full name
            </label>
            <div className="px-5 pb-4">
              <input
                id="gate-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Organisation */}
          <div className="content-card overflow-hidden">
            <label htmlFor="gate-org" className="block px-5 pt-4 pb-1 text-xs font-medium text-muted-foreground">
              Organisation / employer
            </label>
            <div className="px-5 pb-4">
              <input
                id="gate-org"
                type="text"
                value={organisation}
                onChange={e => setOrganisation(e.target.value)}
                placeholder="School, hospital, local authority…"
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                autoComplete="organization"
              />
            </div>
          </div>

          {/* Prior training */}
          <div className="content-card overflow-hidden">
            <label htmlFor="gate-training" className="block px-5 pt-4 pb-1 text-xs font-medium text-muted-foreground">
              Prior training completed
            </label>
            <div className="px-5 pb-4">
              <select
                id="gate-training"
                value={priorTraining}
                onChange={e => setPriorTraining(e.target.value)}
                className="w-full bg-transparent font-sans text-sm text-foreground outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-background text-muted-foreground">
                  Select the training you have completed…
                </option>
                {PRIOR_TRAINING_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-background">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Declaration */}
          <div className="content-card px-5 py-4">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0 w-5 h-5">
                <div className={`w-5 h-5 rounded border-2 transition-colors ${declared ? 'border-primary bg-primary' : 'border-border'}`} />
                {declared && (
                  <span className="absolute inset-0 flex items-center justify-center text-primary-foreground pointer-events-none">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                I confirm that I have completed the training listed above and understand
                that this simulation is intended to support — not substitute — formal
                safeguarding and Prevent training.
              </p>
            </label>
          </div>

        </div>

        {/* Scenario reminder */}
        <p className="text-xs text-muted-foreground mt-6 mb-8">
          Scenario: <span className="text-foreground/80">{scenarioTitle}</span>
        </p>

        <button
          onClick={handleSubmit}
          disabled={!valid}
          className="w-full bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Begin simulation
        </button>
      </motion.div>
    </div>
  );
}
