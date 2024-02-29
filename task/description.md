# Objective
The objective of the exercise is to implement label and row extraction methods that run on standardized text output from a PDF.

These are two of the earliest methods we implemented in the platform.

## Valuable Information
- Label = finds a value adjacent to an anchor line (some static line of text in the document).
- Row = finds a value at approximately the same vertical position as the anchor line.

## Files
- Text file with sample input and output. `sample_input_output.txt`
- Types file specifying the relevant types for the exercise. `types.ts`
- Redacted source PDF `source.pdf`
- PDF text in StandardizedText format, with the redacted pieces changed from their originals. `standardized_text.json`

## Bonus!
A bonus challenge would be to expand the label method to capture multiline values, like under the pickup notes anchor in the PDF.