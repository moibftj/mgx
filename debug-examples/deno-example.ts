// Deno debug example
console.log('Starting Deno debug example...');

function fibonacci(n: number): number {
  console.log(`Computing fibonacci(${n})`);
  
  if (n <= 1) {
    return n;
  }
  
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  console.log(`fibonacci(${n}) = ${result}`);
  return result;
}

async function fetchExample() {
  try {
    console.log('Fetching data from API...');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

async function main() {
  console.log('Deno environment:', Deno.version);
  
  // Set breakpoints on these lines to test debugging
  const numbers = [5, 8, 10];
  
  for (const num of numbers) {
    const fib = fibonacci(num);
    console.log(`Fibonacci of ${num} is ${fib}`);
  }
  
  // Test Deno-specific features
  console.log('Testing Deno fetch...');
  await fetchExample();
  
  // Test file operations
  console.log('Testing file operations...');
  const tempFile = '/tmp/deno-test.txt';
  await Deno.writeTextFile(tempFile, 'Hello from Deno!');
  const content = await Deno.readTextFile(tempFile);
  console.log('File content:', content);
  
  // Cleanup
  await Deno.remove(tempFile);
  console.log('Debug example completed!');
}

if (import.meta.main) {
  main().catch(console.error);
}