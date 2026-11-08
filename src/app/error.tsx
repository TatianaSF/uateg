"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="error-panel" role="alert"><h1>Something went wrong</h1><p>This page could not be shown. Please try again.</p><button className="button button-primary" onClick={reset}>Try again</button></div>;
}
