import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { eventId: null };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      Sentry.withScope((scope) => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({eventId});
      });
    }

    render() {
        if (this.state.hasError) {
            //render fallback UI
            return (
              <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary