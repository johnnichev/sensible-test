import { Label, StandardizedText, StandardizedLine, Row } from "../types/types";

export function extractLabel(configuration: Label, text: StandardizedText): StandardizedLine | null {
    // Logic to find the anchor line and extract the label based on the configuration

    // sample output
    return {
        text: "Extracted label",
        boundingPolygon: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 }
        ]
    }
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