// Node.js debug example
console.log('Starting Node.js debug example...');

function fibonacci(n: number): number {
  console.log(`Computing fibonacci(${n})`);
  
  if (n <= 1) {
    return n;
  }
  
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  console.log(`fibonacci(${n}) = ${result}`);
  return result;
}

async function main() {
  console.log('Node.js environment:', process.version);
  
  // Set breakpoints on these lines to test debugging
  const numbers = [5, 8, 10];
  
  for (const num of numbers) {
    const fib = fibonacci(num);
    console.log(`Fibonacci of ${num} is ${fib}`);
  }
  
  // Test async operations
  console.log('Testing async operation...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Async operation completed!');
}

main().catch(console.error);