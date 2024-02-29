import { Label, StandardizedText, StandardizedLine, Row, Direction, HorizontalDirection, StandardizedPage } from "../types/types";

type AnchorLineInfo = {
    pageNumber: number;
    line: StandardizedLine;
}

export function extractLabel(configuration: Label, text: StandardizedText): StandardizedLine | null {
    const { position, textAlignment, anchor } = configuration;

    // 1. First we need to find the anchor line
    const anchorLineInfo = findLineByText(text.pages, anchor);
    console.log('Anchor line:', anchorLineInfo);
    if (!anchorLineInfo) {
        console.log('Anchor line not found');
        return null;
    }

    // 2. Based on the direction [position] and [textAlignement] we need to find the adjacent line
    // The bounding polygon is assumed to be a rectangle
    // The order of the bounding polygon is assumed to be top-left, top-right, bottom-right, bottom-left
    const adjacentLine = findAdjacentLine(text.pages[anchorLineInfo.pageNumber], anchorLineInfo.line, position, textAlignment);
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

function findLineByText(pages: StandardizedText['pages'], anchor: string): AnchorLineInfo | null {
    // We take into account the upper and lower case of the anchor text
    let pageNumber = -1;
    for (const page of pages) {
        pageNumber++;
        for (const line of page.lines) {
            if (line.text === anchor) {
                // We return the page number and the line to ensure that we can extract the line from the correct page
                return { pageNumber: pageNumber, line };
            }
        }
    }

    return null;
}

function findAdjacentLine(StandardizedPage: StandardizedPage, anchorLine: StandardizedLine, position: Direction, textAlignement: HorizontalDirection): StandardizedLine | null {
    let potentialLines: StandardizedLine[] = [];
    
    if (position === 'above') {
        potentialLines = filterPositionAbove(StandardizedPage, anchorLine);
    }

    if (position === 'below') {
        potentialLines = filterPositionBelow(StandardizedPage, anchorLine);
    }

    if (position === 'right') {
        potentialLines = filterPositionRight(StandardizedPage, anchorLine);
    }

    if (position === 'left') {
        potentialLines = filterPositionLeft(StandardizedPage, anchorLine);
    }

    if (potentialLines.length === 0) return null;

    if (textAlignement === 'left') {
        // Here we get the leftmost X of the anchor
        const anchorLeftX = Math.min(...anchorLine.boundingPolygon.map(point => point.x));
        potentialLines = sortLeft(potentialLines, anchorLeftX);
    }

    if (textAlignement === 'right') {
        // Here we get the rightmost X of the anchor
        const anchorRightX = Math.max(...anchorLine.boundingPolygon.map(point => point.x));
        potentialLines = sortRight(potentialLines, anchorRightX);
    }

    // After filtering and sorting, we need to ensure that the first element of the array is the one we want to return
    // For that we will now check the position and use as a parameter to select the correct line

    if (position === 'above') {
        return potentialLines[potentialLines.length - 1];
    }

    if (position === 'below') {
        return potentialLines[0];
    }

    // if position is right, we want the element with X closest to the anchor right but also closest to the anchor bottom Y
    if (position === 'right') {
        const anchorRightX = Math.max(...anchorLine.boundingPolygon.map(point => point.x)); // Rightmost X of the anchor
        potentialLines = potentialLines.sort((a, b) => {
            return Math.abs(a.boundingPolygon[0].x - anchorRightX) - Math.abs(b.boundingPolygon[0].x - anchorRightX);
        });

        const anchorBottomY = anchorLine.boundingPolygon[1].y; // Top-right
        potentialLines = potentialLines.sort((a, b) => {
            return Math.abs(a.boundingPolygon[0].y - anchorBottomY) - Math.abs(b.boundingPolygon[0].y - anchorBottomY);
        });
    }

    // if position is left, we want the element with X closest to the anchor left but also closest to the anchor top Y
    if (position === 'left') {
        const anchorLeftX = Math.min(...anchorLine.boundingPolygon.map(point => point.x)); // Leftmost X of the anchor
        potentialLines = potentialLines.sort((a, b) => {
            return Math.abs(a.boundingPolygon[1].x - anchorLeftX) - Math.abs(b.boundingPolygon[1].x - anchorLeftX);
        });

        const anchorTopY = anchorLine.boundingPolygon[0].y; // Top-left
        potentialLines = potentialLines.sort((a, b) => {
            return Math.abs(a.boundingPolygon[1].y - anchorTopY) - Math.abs(b.boundingPolygon[1].y - anchorTopY);
        });
    }

    return potentialLines[0];
}

function sortLeft(lines: StandardizedLine[], anchorLeftX: number): StandardizedLine[] {
    // Sort lines based on the closest X of their first or last polygon point to the anchorLeftX
    return lines.sort((a, b) => {
        // Extract the X coordinates of the first and last points for both lines
        const xPointsA = [a.boundingPolygon[0].x, a.boundingPolygon[a.boundingPolygon.length - 1].x];
        const xPointsB = [b.boundingPolygon[0].x, b.boundingPolygon[b.boundingPolygon.length - 1].x];

        // Find the point (first or last) closest to the anchorLeftX for each line
        const closestXA = xPointsA.reduce((prev, curr) => Math.abs(curr - anchorLeftX) < Math.abs(prev - anchorLeftX) ? curr : prev);
        const closestXB = xPointsB.reduce((prev, curr) => Math.abs(curr - anchorLeftX) < Math.abs(prev - anchorLeftX) ? curr : prev);

        // Sort lines by comparing which line's closest point is nearer to the anchorLeftX
        return Math.abs(closestXA - anchorLeftX) - Math.abs(closestXB - anchorLeftX);
    });
}

function sortRight(lines: StandardizedLine[], anchorRightX: number): StandardizedLine[] {
    // Sort lines based on the closest point (first or last) of their bounding polygon to the anchorRightX
    return lines.sort((a, b) => {
        // Extract the X coordinates of the second and third points for both lines
        const xPointsA = [a.boundingPolygon[1].x, a.boundingPolygon[a.boundingPolygon.length - 2].x];
        const xPointsB = [b.boundingPolygon[1].x, b.boundingPolygon[b.boundingPolygon.length - 2].x];
        
        // Determine the closest point to the anchorRightX for each line
        const closestXA = xPointsA.reduce((prev, curr) => Math.abs(curr - anchorRightX) < Math.abs(prev - anchorRightX) ? curr : prev);
        const closestXB = xPointsB.reduce((prev, curr) => Math.abs(curr - anchorRightX) < Math.abs(prev - anchorRightX) ? curr : prev);

        // Compare which line's closest point is nearer to the anchorRightX
        return Math.abs(closestXA - anchorRightX) - Math.abs(closestXB - anchorRightX);
    });
}

function filterPositionBelow(standardizedPage: StandardizedPage, anchorLine: StandardizedLine): StandardizedLine[] {
    const anchorBottomY = anchorLine.boundingPolygon[3].y; // Bottom-left
    
    return standardizedPage.lines.filter(line => line.boundingPolygon[0].y > anchorBottomY)
}

function filterPositionAbove(standardizedPage: StandardizedPage, anchorLine: StandardizedLine): StandardizedLine[] {
    const anchorTopY = anchorLine.boundingPolygon[0].y; // Top-left

    return standardizedPage.lines.filter(line => {
        return line.boundingPolygon[3].y < anchorTopY;
    })
}

function filterPositionRight(standardizedPage: StandardizedPage, anchorLine: StandardizedLine): StandardizedLine[] {
    const anchorRightX = Math.max(...anchorLine.boundingPolygon.map(point => point.x)); // Rightmost X of the anchor

    return standardizedPage.lines.filter(line => Math.min(...line.boundingPolygon.map(point => point.x)) > anchorRightX)
}

function filterPositionLeft(standardizedPage: StandardizedPage, anchorLine: StandardizedLine): StandardizedLine[] {
    const anchorLeftX = Math.min(...anchorLine.boundingPolygon.map(point => point.x)); // Leftmost X of the anchor

    return standardizedPage.lines.filter(line => Math.max(...line.boundingPolygon.map(point => point.x)) < anchorLeftX)
}