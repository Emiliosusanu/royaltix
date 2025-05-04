
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-950">
          <Card className="w-full max-w-md shadow-lg border-destructive bg-background">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <CardTitle className="text-2xl font-bold text-destructive">Oops! Something went wrong.</CardTitle>
              <CardDescription className="text-muted-foreground">
                We encountered an unexpected issue. Refreshing the page might help. If the problem persists, please check your connection or try again later.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
               {import.meta.env.DEV && this.state.error && (
                 <details className="text-left text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-dashed border-muted-foreground/50 mb-4">
                   <summary>Error Details (Development Only)</summary>
                   <pre className="mt-2 whitespace-pre-wrap break-words">
                     {this.state.error.toString()}
                     {this.state.error.stack && `\n\nStack:\n${this.state.error.stack}`}
                   </pre>
                 </details>
               )}
              <Button onClick={() => window.location.reload()} className="w-full">
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
  