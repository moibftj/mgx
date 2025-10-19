// Deno test example
import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";

function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

Deno.test("add function", () => {
  assertEquals(add(2, 3), 5);
  assertEquals(add(-1, 1), 0);
  assertEquals(add(0, 0), 0);
});

Deno.test("multiply function", () => {
  assertEquals(multiply(2, 3), 6);
  assertEquals(multiply(-2, 3), -6);
  assertEquals(multiply(0, 5), 0);
});

Deno.test("async test example", async () => {
  const promise = new Promise<number>((resolve) => {
    setTimeout(() => resolve(42), 100);
  });
  
  const result = await promise;
  assertEquals(result, 42);
});