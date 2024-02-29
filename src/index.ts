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

function main() {
  const input: Label | Row = getInputFromFile('./data/input.json');
  const standardizedText: StandardizedText = loadStandardizedText('./data/standardized_text.json');

  if (isLabel(input)) {
    return extractLabel(input, standardizedText);
  } else {
    return extractRow(input, standardizedText);
  }
}

main();
