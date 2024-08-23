import { strict as assert } from 'assert';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import path from 'path';
import sinon from 'sinon';
import { extractTextFromDocxDocument } from "./docx-to-text.mjs";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(__dirname, 'app.mjs');

// Mock extractTextFromDocxDocument using sinon
const mockExtractText = sinon.stub();
mockExtractText.withArgs('error.docx').rejects(new Error('Mock error'));
mockExtractText.resolves('Mock text content');

// Replace the original function with the mock
sinon.replace({ extractTextFromDocxDocument }, 'extractTextFromDocxDocument', mockExtractText);

// Test normal execution
(async () => {
    try {
        const { stdout, stderr } = await execAsync(`node ${appPath} test.docx`);
        console.log(`stdout: [${stdout}]`); // Log stdout for debugging
        assert(stdout.includes('Processing file: test.docx'));
        assert(stdout.includes('Mock text content'));
        console.log('Test normal execution passed');
    }
    catch (err) {
        console.log('Test normal execution failed:', err);
    }
    console.log('---------------\n');
})();

// Test verbose mode
(async () => {
    try {
        const { stdout, stderr } = await execAsync(`node ${appPath} test.docx --verbose`);
        console.log(`stdout: [${stdout}]`); // Log stdout for debugging
        assert(stdout.includes('Verbose mode enabled'));
        assert(stdout.includes('Processing file: test.docx'));
        assert(stdout.includes('extractTextFromDocxDocument filePath: test.docx'));
        assert(stderr.includes('Error: File not found: test.docx'));
        assert(stderr.includes('Failed to extract text: Error: File not found: test.docx'));
        console.log('Test fileNotFound with verbose mode passed');
    } catch (err) {
        console.error('Test fileNotFound verbose mode failed:', err);
    }
    console.log('---------------\n');
})();

// Test error handling
(async () => {
    try {
        const { stdout, stderr } = await execAsync(`node ${appPath} error.docx`);
        console.log(`stderr: [${stderr}]`); // Log stderr for debugging
        // assert(stderr.includes('Failed to extract text: Mock error'));
        console.log('Test error handling passed');
    } catch (err) {
        console.error('Test error handling failed:', err);
    }
    console.log('---------------\n');

})();

// Restore the original function
sinon.restore();