import React from 'react'

type ErrorBoundaryInfo = Record<string, any>

type ErrorBoundaryState = {
  error: Error | null,
  errorInfo: ErrorBoundaryInfo | null,
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }
  
  componentDidCatch(error: Error | null, errorInfo: object) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }
  
  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h4>Something went wrong:</h4>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {
              this.state.error && (
                <summary>{ this.state.error.toString() }</summary>
              )
            }
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }  
}

export default ErrorBoundary