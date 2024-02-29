import { Label, StandardizedText, StandardizedLine, Row } from "../types/types";

export function extractLabel(configuration: Label, text: StandardizedText): StandardizedLine | null {
    const { position, textAlignment, anchor } = configuration;

    // 1. First we need to find the anchor line
    console.log('Finding anchor line...');
    const anchorLine = findLineByText(text.pages, anchor);
    if (!anchorLine) {
        console.log('Anchor line not found');
        return null; // If the anchor line is not found, we return null
    }
    console.log('Anchor line:', anchorLine);

    // 2. Based on the direction [position] and [textAlignement] we need to find the adjacent line
    // The binding polygon is assumed to be a rectangle, so we can use the bounding polygon to find the adjacent line
    // The order of the bounding polygon is assumed to be top-left, top-right, bottom-right, bottom-left
    // The [position] and [textAlignement] will help us assume which Polygon to use to find the adjacent line


    




    return anchorLine;
}
  
export function extractRow(configuration: Row, text: StandardizedText): StandardizedLine | null {
    // Logic to find the anchor line and extract the row based on the configuration

    // sample output
    return {
        text: "Extracted row",
        boundingPolygon: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 }
        ]
    }
}

function findLineByText(pages: StandardizedText['pages'], anchor: string): StandardizedLine | null {
    const lowerCaseAnchor = anchor.toLowerCase();

    for (const page of pages) {
      for (const line of page.lines) {
        if (line.text.toLowerCase().includes(lowerCaseAnchor)) {
          return line;
        }
      }
    }

    return null;
  }