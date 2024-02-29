import { Label, StandardizedText, StandardizedLine, Row, Polygon, Direction, HorizontalDirection } from "../types/types";

export function extractLabel(configuration: Label, text: StandardizedText): StandardizedLine | null {
    const { position, textAlignment, anchor } = configuration;

    // 1. First we need to find the anchor line
    console.log('Finding anchor line...');
    const anchorLine = findLineByText(text.pages, anchor);
    if (!anchorLine) {
        console.log('Anchor line not found');
        return null;
    }
    console.log('Anchor line:', anchorLine);

    // 2. Based on the direction [position] and [textAlignement] we need to find the adjacent line
    // The binding polygon is assumed to be a rectangle
    // The order of the bounding polygon is assumed to be top-left, top-right, bottom-right, bottom-left
    console.log('Finding adjacent line...');
    const adjacentLine = findAdjacentLine(text, anchorLine, position, textAlignment);
    if (!adjacentLine) {
        console.log('Adjacent line not found');
        return null;
    }

    return adjacentLine;
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

function findAdjacentLine(standardizedText: StandardizedText, anchorLine: StandardizedLine, position: Direction, textAlignement: HorizontalDirection): StandardizedLine | null {
    let anchorPoint: Polygon[0];

    if (position === 'above' && textAlignement === 'left') {
        anchorPoint = anchorLine.boundingPolygon[0]; // Top-left
    } else if (position === 'above' && textAlignement === 'right') {
        anchorPoint = anchorLine.boundingPolygon[1]; // Top-right
    } else if (position === 'below' && textAlignement === 'left') {
        anchorPoint = anchorLine.boundingPolygon[3]; // Bottom-left
        return findDirectlyBelowLine(standardizedText, anchorPoint);
    } else if (position === 'below' && textAlignement === 'right') {
        anchorPoint = anchorLine.boundingPolygon[2]; // Bottom-right
    }

    // Additional logic needed to find the adjacent line based on the anchor point

    return null;
}

function findDirectlyBelowLine(standardizedText: StandardizedText, anchorPolygon: Polygon[0]): StandardizedLine | null {
    const { x: anchorX, y: anchorY } = anchorPolygon;

    // Filter lines that are below the anchor line
    // We are assuming the coordinate system (0,0) origin is the top-left corner
    let potentialLines = standardizedText.pages.flatMap(page => page.lines.filter(line => 
        line.boundingPolygon[0].y > anchorY && // Top-left Y of line is below anchor's bottom-left Y
        line.boundingPolygon[0].x === anchorX)  // Top-left X of line matches anchor's bottom-left X
    );

    // Sort by Y to find the closest below
    potentialLines.sort((a, b) => a.boundingPolygon[0].y - b.boundingPolygon[0].y);

    // Return the first matching line or null
    return potentialLines.length > 0 ? potentialLines[0] : null;
}