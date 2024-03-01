import { readFileSync } from 'fs';
import { Label, Row, StandardizedText } from './types/types';
import { extractLabel, extractRow } from './utils/textProcessing';

function isLabel(input: Label | Row): input is Label {
  return input.id === 'label';
}

function getInputFromFile(filePath: string): Label | Row {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

function loadStandardizedText(filePath: string): StandardizedText {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as StandardizedText;
}

// Assumptions:
// - The input file is always valid
// - The standardized text file is always valid
// - The input file is either a label or a row
// - The input file is always a JSON file
// - The bounding polygon is assumed to be a rectangle
// - The order of the bounding polygon is assumed to be top-left, top-right, bottom-right, bottom-left
// - The document (0, 0) coordinate is assumed to be the top-left corner

function main() {
  const input: Label | Row = getInputFromFile('./data/input.json');
  const standardizedText: StandardizedText = loadStandardizedText('./data/standardized_text.json');

  if (isLabel(input)) {
    console.log('Extracting label...');
    const extractedLabel = extractLabel(input, standardizedText);
    console.log('Extracted label:');
    console.log(extractedLabel);
  } else {
    console.log('Extracting row...');
    const extractedRow = extractRow(input, standardizedText);
    console.log('Extracted row:');
    console.log(extractedRow);
  }
}

main();
