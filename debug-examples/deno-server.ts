// Deno HTTP Server example
console.log('Starting Deno HTTP server...');

const port = 8000;

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  console.log(`${request.method} ${url.pathname}`);
  
  // Set breakpoints here to debug incoming requests
  switch (url.pathname) {
    case '/':
      return new Response('Hello from Deno HTTP Server!', {
        headers: { 'content-type': 'text/plain' }
      });
    
    case '/api/fibonacci': {
      const n = parseInt(url.searchParams.get('n') || '10');
      const result = fibonacci(n);
      return Response.json({ n, fibonacci: result });
    }
    
    case '/api/time':
      return Response.json({ 
        timestamp: Date.now(),
        iso: new Date().toISOString()
      });
    
    default:
      return new Response('Not Found', { status: 404 });
  }
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(`HTTP server starting on http://localhost:${port}/`);

// Start the server
Deno.serve({ port }, handler);