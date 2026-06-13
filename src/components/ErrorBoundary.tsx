import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Optional label shown in the error panel (e.g. "simulation" vs "results") */
  context?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev; swap for a real logger (Sentry etc.) later
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const context = this.props.context ?? 'page';

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="case-panel max-w-lg w-full p-8 space-y-6">
          {/* Header */}
          <div className="border-b border-border pb-4">
            <p className="hud-label text-primary mb-1">System error</p>
            <h2 className="font-mono text-lg uppercase tracking-[0.15em] text-foreground">
              Something went wrong
            </h2>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred in the {context}. Your progress up to the
            last completed scene has been saved.
          </p>

          {/* Error detail — collapsed in prod feel, readable in dev */}
          <div className="bg-secondary/40 border border-border p-4">
            <p className="font-mono text-xs text-muted-foreground break-words whitespace-pre-wrap">
              {error.message || String(error)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={this.reset}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] hover:bg-primary/80 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => { this.reset(); window.location.href = '/'; }}
              className="flex-1 px-4 py-2 bg-secondary border border-border font-mono text-xs uppercase tracking-[0.15em] hover:bg-secondary/80 transition-colors"
            >
              Return to menu
            </button>
          </div>
        </div>
      </div>
    );
  }
}
