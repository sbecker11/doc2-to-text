#!/usr/bin/env node

import { Command } from 'commander';
import { extractTextFromDocxDocument } from "./docx-to-text.mjs";

const program = new Command();

program
    .argument('<docxFile>', 'DOCX file to process')
    .option('-q, --quiet', 'suppress output')
    .option('-v, --verbose', 'enable verbose output')
    .action(async (docxFile, options) => {
        const isQuiet = options.quiet;
        const isVerbose = options.verbose;

        if (isVerbose) console.log(`Verbose mode enabled`);
        if (!isQuiet) console.log(`Processing file: ${docxFile}`);

        try {
            const text = await extractTextFromDocxDocument(docxFile);
            if (!isQuiet) console.log(text);
            if (isVerbose) console.log(`Successfully processed ${docxFile} with ${text.length} chars`);
        } catch (error) {
            console.error(`Failed to extract text: ${error.message}`);
        }
    });

program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ node app.mjs full-resume.docx');
    console.log('  $ node app.mjs full-resume.docx --quiet');
    console.log('  $ node app.mjs full-resume.docx --verbose');
});

if (process.argv.length < 3) {
    program.help();
}

program.parse(process.argv);