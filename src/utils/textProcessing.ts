import {
  Label,
  StandardizedText,
  StandardizedLine,
  Row,
  Direction,
  HorizontalDirection,
  StandardizedPage,
  AnchorLineInfo,
} from "../types/types";

/**
 * Extracts a line item from a given text based on a label configuration.
 * @param configuration The label configuration.
 * @param text The text to search for the line.
 * @returns The extracted line item, or null if not found.
 */
export function extractLabel(
  configuration: Label,
  text: StandardizedText,
): StandardizedLine | null {
  const { position, textAlignment, anchor } = configuration;

  // 1. First we need to find the anchor line
  const anchorLineInfo = findAnchorLine(text.pages, anchor);
  console.log("Anchor line:", anchorLineInfo?.line);
  if (!anchorLineInfo) {
    console.log("Anchor line not found");
    return null;
  }

  // 2. Based on the direction [position] and [textAlignement] we need to find the adjacent line
  const adjacentLine = findAdjacentLine(
    text.pages[anchorLineInfo.pageNumber],
    anchorLineInfo.line,
    position,
    textAlignment,
  );
  if (!adjacentLine) {
    console.log("Adjacent line not found");
    return null;
  }

  return adjacentLine;
}

/**
 * Extracts a line item from the given text based on the provided configuration.
 *
 * @param configuration - The configuration object specifying the row properties.
 * @param text - The text containing the pages and lines.
 * @returns The extracted line item, or null if not found.
 */
export function extractRow(
  configuration: Row,
  text: StandardizedText,
): StandardizedLine | null {
  const { position, tiebreaker, anchor } = configuration;

  // 1. First we need to find the anchor line
  const anchorLineInfo = findAnchorLine(text.pages, anchor);
  console.log("Anchor line:", anchorLineInfo?.line);
  if (!anchorLineInfo) {
    console.log("Anchor line not found");
    return null;
  }

  // 2. Based on the direction [position] we need to find the adjacent line
  const verticalLine = findVerticalLine(
    text.pages[anchorLineInfo.pageNumber],
    anchorLineInfo.line,
    position,
    tiebreaker,
  );
  if (!verticalLine) {
    console.log("Vertical line not found");
    return null;
  }

  return verticalLine;
}

/**
 * Finds the anchor line in the given pages of the text.
 *
 * @param pages - The pages of text.
 * @param anchor - The anchor text to search for.
 * @returns The information about the anchor line, including the page number and the line, or null if the anchor line is not found.
 */
export function findAnchorLine(
  pages: StandardizedText["pages"],
  anchor: string,
): AnchorLineInfo | null {
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

/**
 * Finds a vertical line relative to an anchor line in a standardized page.
 *
 * @param StandardizedPage - The page object with the lines.
 * @param anchorLine - The anchor line to find the vertical line relative to.
 * @param position - The horizontal direction to search for the vertical line.
 * @param tieBreaker - The tiebreaker rule to use when multiple lines are found.
 * @returns The closest vertical line to the anchor line based on the given parameters, or null if no line is found.
 */
export function findVerticalLine(
  StandardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
  position: HorizontalDirection,
  tieBreaker: Row["tiebreaker"],
): StandardizedLine | null {
  const potentialLines = filterFunctions[position](
    StandardizedPage,
    anchorLine,
  );
  if (potentialLines.length === 0) return null;
  console.log("Potential lines:", potentialLines);

  // If there is only one line, we return it
  if (potentialLines.length === 1) return potentialLines[0];

  // Now we filter the potentialLines to get the lines that are closest to the anchor line Y, using a rule of Y +- 0.05, we also assume the reader is reading from top to bottom and left to right so we don't need to sort the lines
  const anchorY =
    (anchorLine.boundingPolygon[0].y + anchorLine.boundingPolygon[3].y) / 2;
  const closerLines = potentialLines.filter((line) => {
    const lineY = (line.boundingPolygon[0].y + line.boundingPolygon[3].y) / 2;
    return Math.abs(lineY - anchorY) < 0.05;
  });
  console.log("Closer lines:", closerLines);

  if (closerLines.length === 1) return closerLines[0];

  if (closerLines.length === 0) return null;

  if (tieBreaker === "last") {
    return closerLines[closerLines.length - 1];
  }

  const verticalLine = closerLines[tieBreaker - 1];
  if (!verticalLine) return null;

  return verticalLine;
}

/**
 * Finds the adjacent line based on the given parameters.
 *
 * @param StandardizedPage - The page object with the lines.
 * @param anchorLine - The anchor line to find adjacent lines from.
 * @param position - The direction of the adjacent lines (above, below, right, left).
 * @param textAlignment - The horizontal direction of the text alignment (left, right).
 * @returns The closest line adjacent to the anchor line, or null if no adjacent line is found.
 */
export function findAdjacentLine(
  StandardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
  position: Direction,
  textAlignment: HorizontalDirection,
): StandardizedLine | null {
  const potentialLines = filterFunctions[position](
    StandardizedPage,
    anchorLine,
  );
  let closerLines = potentialLines;

  if (potentialLines.length === 0) return null;

  console.log("Potential lines:", potentialLines);

  // Determine anchor X
  const anchorX =
    textAlignment === "left"
      ? Math.min(...anchorLine.boundingPolygon.map((point) => point.x))
      : Math.max(...anchorLine.boundingPolygon.map((point) => point.x));

  // We want the three elements closest to the anchor top
  if (position === "above") {
    const anchorTopY = anchorLine.boundingPolygon[0].y; // Top-left
    closerLines = potentialLines
      .sort((a, b) => {
        return (
          Math.abs(a.boundingPolygon[3].y - anchorTopY) -
          Math.abs(b.boundingPolygon[3].y - anchorTopY)
        );
      })
      .slice(0, 3);
  }

  // We want the three elements closest to the anchor bottom
  if (position === "below") {
    const anchorBottomY = anchorLine.boundingPolygon[3].y; // Bottom-left
    closerLines = potentialLines
      .sort((a, b) => {
        return (
          Math.abs(a.boundingPolygon[0].y - anchorBottomY) -
          Math.abs(b.boundingPolygon[0].y - anchorBottomY)
        );
      })
      .slice(0, 3);
  }

  // We want the three elements closest to the anchor right
  if (position === "right") {
    closerLines = potentialLines
      .sort((a, b) => {
        return (
          Math.abs(a.boundingPolygon[0].x - anchorX) -
          Math.abs(b.boundingPolygon[0].x - anchorX)
        );
      })
      .slice(0, 3);
  }

  // We want the three elements closest to the anchor left
  if (position === "left") {
    closerLines = potentialLines
      .sort((a, b) => {
        return (
          Math.abs(a.boundingPolygon[1].x - anchorX) -
          Math.abs(b.boundingPolygon[1].x - anchorX)
        );
      })
      .slice(0, 3);
  }

  //  We sort the lines based on the textAlignment and return the closest line
  const sortedLines = sortFunctions[textAlignment](closerLines, anchorX);
  console.log("Sorted lines:", sortedLines);

  return sortedLines[0];
}

const sortFunctions = {
  left: sortLeft,
  right: sortRight,
};

const filterFunctions = {
  above: filterPositionAbove,
  below: filterPositionBelow,
  left: filterPositionLeft,
  right: filterPositionRight,
};

/**
 * Sorts an array of lines based on their distance to the anchorLeftX.
 * @param lines - The array of lines to be sorted.
 * @param anchorLeftX - The X-coordinate of the anchor point.
 * @returns The sorted array of lines.
 */
export function sortLeft(
  lines: StandardizedLine[],
  anchorLeftX: number,
): StandardizedLine[] {
  // Simplified sorting based on the distance to the anchorLeftX
  return lines.sort((a, b) => {
    const rightA = Math.max(...a.boundingPolygon.map((point) => point.x)); // Rightmost X of line A
    const rightB = Math.max(...b.boundingPolygon.map((point) => point.x)); // Rightmost X of line B
    return Math.abs(rightA - anchorLeftX) - Math.abs(rightB - anchorLeftX);
  });
}

/**
 * Sorts an array of lines based on their distance to the anchorRightX.
 * @param lines - The array of lines to be sorted.
 * @param anchorRightX - The x-coordinate of the anchor point.
 * @returns The sorted array of lines.
 */
export function sortRight(
  lines: StandardizedLine[],
  anchorRightX: number,
): StandardizedLine[] {
  // Simplified sorting based on the distance to the anchorRightX
  return lines.sort((a, b) => {
    const leftA = Math.min(...a.boundingPolygon.map((point) => point.x)); // Leftmost X of line A
    const leftB = Math.min(...b.boundingPolygon.map((point) => point.x)); // Leftmost X of line B
    return Math.abs(leftA - anchorRightX) - Math.abs(leftB - anchorRightX);
  });
}

/**
 * Filters the lines below the anchor line.
 *
 * @param standardizedPage - The page containing the lines.
 * @param anchorLine - The anchor line to compare against.
 * @returns An array of lines below the anchor line.
 */
export function filterPositionBelow(
  standardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
): StandardizedLine[] {
  const anchorBottomY = anchorLine.boundingPolygon[3].y; // Bottom-left

  return standardizedPage.lines.filter(
    (line) => line.boundingPolygon[0].y >= anchorBottomY,
  );
}

/**
 * Filters the lines above the anchor line.
 *
 * @param standardizedPage - The page containing the lines.
 * @param anchorLine - The anchor line to compare against.
 * @returns An array of lines above the anchor line.
 */
export function filterPositionAbove(
  standardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
): StandardizedLine[] {
  const anchorTopY = anchorLine.boundingPolygon[0].y; // Top-left

  return standardizedPage.lines.filter((line) => {
    return line.boundingPolygon[3].y <= anchorTopY;
  });
}

/**
 * Filters the lines to the right of the anchor line.
 *
 * @param standardizedPage - The page containing the lines.
 * @param anchorLine - The anchor line to compare against.
 * @returns An array of lines to the right of the anchor line.
 */
export function filterPositionRight(
  standardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
): StandardizedLine[] {
  const anchorRightX = anchorLine.boundingPolygon[1].x; // Rightmost X of the anchor

  return standardizedPage.lines.filter(
    (line) =>
      Math.min(...line.boundingPolygon.map((point) => point.x)) >= anchorRightX,
  );
}

/**
 * Filters the lines to the left of the anchor line.
 *
 * @param standardizedPage - The page containing the lines.
 * @param anchorLine - The anchor line to compare against.
 * @returns An array of lines to the left of the anchor line.
 */
export function filterPositionLeft(
  standardizedPage: StandardizedPage,
  anchorLine: StandardizedLine,
): StandardizedLine[] {
  const anchorLeftX = anchorLine.boundingPolygon[0].x; // Leftmost X of the anchor

  return standardizedPage.lines.filter(
    (line) =>
      Math.max(...line.boundingPolygon.map((point) => point.x)) <= anchorLeftX,
  );
}
