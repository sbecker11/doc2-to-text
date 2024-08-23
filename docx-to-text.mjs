import fs from 'fs';
import mammoth from 'mammoth';

export async function extractTextFromDocxDocument(filePath) {

    console.info(`extractTextFromDocxDocument filePath: ${filePath}`);
    if (filePath == null || typeof filePath != 'string' || filePath.length == 0 ) {
        log.error("Error: Null or undefined or empty file path");
        throw new Error("Error: Null or undefined or empty file path");
    }
    if ( fs.existsSync(filePath) === false ) {
        console.error(`Error: File not found: ${filePath}`);
        throw new Error(`Error: File not found: ${filePath}`);  
    }
    try {
        const fileBuffer = fs.readFileSync (filePath);
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        console.info(`extractTextFromDocxDocument returning text.length: ${result.value.length}`);
        return result.value;
    } catch (err) {
        console.error('Error extracting text from DOCX:', err);
        throw err;
    }
}
