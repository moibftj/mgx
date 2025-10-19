# Debug Configuration Guide

This project now includes debug configurations for both Node.js and Deno environments.

## Prerequisites

- ✅ Node.js (already installed via your package.json)
- ✅ Deno (installed at `/home/codespace/.deno/bin/deno`)

## Available Debug Configurations

### Node.js Debugging

1. **Debug Vite Dev Server (Node.js)** - Debug your Vite development server
2. **Debug React App in Browser** - Debug your React app in Chrome
3. **Debug Node.js Script** - Debug any Node.js/TypeScript file
4. **Attach to Chrome** - Attach debugger to running Chrome instance

### Deno Debugging

1. **Debug Deno Script** - Debug any Deno TypeScript file with full permissions
2. **Debug Deno with Limited Permissions** - Debug with restricted permissions
3. **Debug Deno Test** - Debug Deno test files
4. **Attach to Deno** - Attach to a running Deno process

### Compound Configurations

1. **Debug Full Stack (Node.js + Browser)** - Debug both server and client simultaneously

## How to Use

### For Node.js:
1. Open `debug-examples/node-example.ts`
2. Set breakpoints by clicking in the gutter
3. Press `F5` or go to Run & Debug panel
4. Select "Debug Node.js Script"
5. The debugger will start and hit your breakpoints

### For Deno:
1. Open `debug-examples/deno-example.ts`
2. Set breakpoints by clicking in the gutter
3. Press `F5` or go to Run & Debug panel
4. Select "Debug Deno Script"
5. The debugger will start and hit your breakpoints

### For React App:
1. Press `F5` or go to Run & Debug panel
2. Select "Debug Full Stack (Node.js + Browser)"
3. This will start the Vite dev server and open Chrome for debugging

## Example Files

- `debug-examples/node-example.ts` - Node.js debugging example
- `debug-examples/deno-example.ts` - Deno debugging example with API calls
- `debug-examples/deno-test.ts` - Deno test debugging example
- `debug-examples/deno-server.ts` - Deno HTTP server example

## Testing the Setup

### Test Node.js Debugging:
1. Open `debug-examples/node-example.ts`
2. Set a breakpoint on line with `fibonacci(num)`
3. Start "Debug Node.js Script"
4. Step through the code and inspect variables

### Test Deno Debugging:
1. Open `debug-examples/deno-example.ts`
2. Set a breakpoint on the API fetch line
3. Start "Debug Deno Script"
4. The debugger will pause and you can inspect the fetch operation

### Test Deno Server:
1. Open `debug-examples/deno-server.ts`
2. Set a breakpoint in the `handler` function
3. Start "Debug Deno Script"
4. Open browser to `http://localhost:8000`
5. The debugger will hit your breakpoint on each request

### Test Deno Tests:
1. Open `debug-examples/deno-test.ts`
2. Set breakpoints in test functions
3. Start "Debug Deno Test"
4. The debugger will pause in your test code

## Troubleshooting

- If Deno path is not found, make sure `/home/codespace/.deno/bin` is in your PATH
- For permission errors with Deno, use the "Debug Deno with Limited Permissions" configuration
- If Chrome debugging doesn't work, ensure you have Chrome installed or use a different browser
- Make sure to install TypeScript support: `npm install -g tsx` for better Node.js TypeScript debugging

## VS Code Extensions Recommended

- Deno extension for better Deno support
- Chrome Debugger extension (usually built-in)
- TypeScript Hero for better TypeScript debugging

Enjoy debugging! 🐛🔍