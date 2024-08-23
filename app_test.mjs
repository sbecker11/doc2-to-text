import { strict as assert } from 'assert';
import { main } from './app.mjs';

// Mock console.log
const originalLog = console.log;
let logOutput = '';
console.log = (msg) => {
    logOutput += msg + '\n';
};

// Test
try {
    main();
    assert.strictEqual(logOutput.trim(), "Hello from the sample command-line app!");
    console.log("Test passed!");
} catch (error) {
    console.error("Test failed:", error);
} finally {
    // Restore console.log
    console.log = originalLog;
}
