import {describe, expect, test, it} from '@jest/globals';
import { loadStandardizedText } from '../index';
import { extractLabel, extractRow, filterPositionAbove, filterPositionBelow, filterPositionLeft, filterPositionRight, findAnchorLine, sortLeft, sortRight } from './textProcessing';
import { Label, Row } from '../types/types';

const standardizedText = loadStandardizedText('./data/standardized_text.json');

describe('findAnchorLine', () => {
    const pages = standardizedText.pages;
  
    test('should return null if anchor line is not found', () => {
        const result = findAnchorLine(pages, 'nonexistent');
        expect(result).toBeNull();
    });
  
    it('should return the correct page number and line when anchor line is found', () => {
        const result = findAnchorLine(pages, 'Distance');
        expect(result).toEqual({
            pageNumber: 0, 
            line: { 
                text: 'Distance',
                boundingPolygon: [
                    { x: 2.005, y: 4.224 },
                    { x: 2.438, y: 4.224 },
                    { x: 2.438, y: 4.328 },
                    { x: 2.005, y: 4.328 }
                ],
            },
        });
    });

    
    it('should return the correct page number and line when anchor line is found', () => {
        const result = findAnchorLine(pages, 'Attention');
        expect(result).toEqual({
            pageNumber: 1, 
            line: { 
                text: 'Attention',
                boundingPolygon: [
                    { x: 0.943, y: 2.749 },
                    { x: 1.592, y: 2.749 },
                    { x: 1.592, y: 2.904 },
                    { x: 0.943, y: 2.904 }
                ],
            },
        });
    });
});

describe('sortLeft', () => {
    const lines = [
        { 
            text: 'Line 1',
            boundingPolygon: [
                { x: 1.0, y: 1.0 },
                { x: 2.0, y: 1.0 },
                { x: 2.0, y: 2.0 },
                { x: 1.0, y: 2.0 }
            ],
        },
        { 
            text: 'Line 2',
            boundingPolygon: [
                { x: 3.0, y: 1.0 },
                { x: 4.0, y: 1.0 },
                { x: 4.0, y: 2.0 },
                { x: 3.0, y: 2.0 }
            ],
        },
        { 
            text: 'Line 3',
            boundingPolygon: [
                { x: 2.5, y: 1.0 },
                { x: 3.5, y: 1.0 },
                { x: 3.5, y: 2.0 },
                { x: 2.5, y: 2.0 }
            ],
        },
    ];

    it('should sort lines based on the distance to the anchorLeftX', () => {
        const anchorLeftX = 2.0;
        const sortedLines = sortLeft(lines, anchorLeftX);
        expect(sortedLines).toEqual([
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 2.0 },
                    { x: 1.0, y: 2.0 }
                ],
            },
            { 
                text: 'Line 3',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
        ]);
    });
});

describe('sortRight', () => {
    const lines = [
        { 
            text: 'Line 1',
            boundingPolygon: [
                { x: 1.0, y: 1.0 },
                { x: 2.0, y: 1.0 },
                { x: 2.0, y: 2.0 },
                { x: 1.0, y: 2.0 }
            ],
        },
        { 
            text: 'Line 2',
            boundingPolygon: [
                { x: 3.0, y: 1.0 },
                { x: 4.0, y: 1.0 },
                { x: 4.0, y: 2.0 },
                { x: 3.0, y: 2.0 }
            ],
        },
        { 
            text: 'Line 3',
            boundingPolygon: [
                { x: 2.5, y: 1.0 },
                { x: 3.5, y: 1.0 },
                { x: 3.5, y: 2.0 },
                { x: 2.5, y: 2.0 }
            ],
        },
    ];

    it('should sort lines based on the distance to the anchorRightX', () => {
        const anchorRightX = 4.0;
        const sortedLines = sortRight(lines, anchorRightX);
        expect(sortedLines).toEqual([
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
            { 
                text: 'Line 3',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 2.0 },
                    { x: 1.0, y: 2.0 }
                ],
            },
        ]);
    });
});


describe('filterPositionRight', () => {
    const standardizedPage = {
        lines: [
            { 
                text: 'Anchor Line',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 2.0 },
                    { x: 1.0, y: 2.0 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
            { 
                text: 'Line 3',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
        ]
    };

    const anchorLine = { 
        text: 'Anchor Line',
        boundingPolygon: [
            { x: 1.0, y: 1.0 },
            { x: 2.0, y: 1.0 },
            { x: 2.0, y: 2.0 },
            { x: 1.0, y: 2.0 }
        ],
    };

    it('should return lines positioned to the right of the anchor line', () => {
        const result = filterPositionRight(standardizedPage, anchorLine);
        expect(result).toEqual([
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
            { 
                text: 'Line 3',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
        ]);
    });

    it('should return an empty array if no lines are positioned to the right of the anchor line', () => {
        const result = filterPositionRight(standardizedPage, {
            text: 'Anchor Line',
            boundingPolygon: [
                { x: 5.0, y: 1.0 },
                { x: 6.0, y: 1.0 },
                { x: 6.0, y: 2.0 },
                { x: 5.0, y: 2.0 }
            ],
        });
        expect(result).toEqual([]);
    });
});

describe('filterPositionLeft', () => {
    const standardizedPage = {
        lines: [
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.5, y: 1.0 },
                    { x: 2.5, y: 1.0 },
                    { x: 2.5, y: 2.0 },
                    { x: 1.5, y: 2.0 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 2.0 },
                    { x: 1.0, y: 2.0 }
                ],
            },
            { 
                text: 'Anchor Line',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
        ]
    };

    const anchorLine = { 
        text: 'Anchor Line',
        boundingPolygon: [
            { x: 2.5, y: 1.0 },
            { x: 3.5, y: 1.0 },
            { x: 3.5, y: 2.0 },
            { x: 2.5, y: 2.0 }
        ],
    };

    it('should return lines positioned to the left of the anchor line', () => {
        const result = filterPositionLeft(standardizedPage, anchorLine);
        expect(result).toEqual([
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.5, y: 1.0 },
                    { x: 2.5, y: 1.0 },
                    { x: 2.5, y: 2.0 },
                    { x: 1.5, y: 2.0 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 2.0 },
                    { x: 1.0, y: 2.0 }
                ],
            },
        ]);
    });

    it('should return an empty array if no lines are positioned to the left of the anchor line', () => {
        const result = filterPositionLeft(standardizedPage, {
            text: 'Anchor Line',
            boundingPolygon: [
                { x: 0.5, y: 1.0 },
                { x: 1.0, y: 1.0 },
                { x: 1.0, y: 2.0 },
                { x: 0.5, y: 2.0 }
            ],
        });
        expect(result).toEqual([]);
    });
});

describe('filterPositionAbove', () => {
    const standardizedPage = {
        lines: [
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 1.5 },
                    { x: 1.0, y: 1.5 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
            { 
                text: 'Anchor Line',
                boundingPolygon: [
                    { x: 2.0, y: 2.5 },
                    { x: 3.0, y: 2.5 },
                    { x: 3.0, y: 3.5 },
                    { x: 2.0, y: 3.5 }
                ],
            },
            { 
                text: 'Line 3',
                boundingPolygon: [
                    { x: 3.0, y: 3.0 },
                    { x: 4.0, y: 3.0 },
                    { x: 4.0, y: 4.0 },
                    { x: 3.0, y: 4.0 }
                ],
            },
        ]
    };

    const anchorLine = { 
        text: 'Anchor Line',
        boundingPolygon: [
            { x: 2.0, y: 2.5 },
            { x: 3.0, y: 2.5 },
            { x: 3.0, y: 3.5 },
            { x: 2.0, y: 3.5 }
        ],
    };

    it('should return lines positioned above the anchor line', () => {
        const result = filterPositionAbove(standardizedPage, anchorLine);
        expect(result).toEqual([
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.0, y: 1.0 },
                    { x: 2.0, y: 1.0 },
                    { x: 2.0, y: 1.5 },
                    { x: 1.0, y: 1.5 }
                ],
            },
            { 
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 1.0 },
                    { x: 4.0, y: 1.0 },
                    { x: 4.0, y: 2.0 },
                    { x: 3.0, y: 2.0 }
                ],
            },
        ]);
    });

    it('should return an empty array if no lines are positioned above the anchor line', () => {
        const result = filterPositionAbove(standardizedPage, {
            text: 'Anchor Line',
            boundingPolygon: [
                { x: 2.0, y: 0.5 },
                { x: 3.0, y: 0.5 },
                { x: 3.0, y: 1.5 },
                { x: 2.0, y: 1.5 }
            ],
        });
        expect(result).toEqual([]);
    });
});

describe('filterPositionBelow', () => {
    const standardizedPage = {
        lines: [
            { 
                text: 'Line 1',
                boundingPolygon: [
                    { x: 1.0, y: 0.5 },
                    { x: 2.0, y: 0.5 },
                    { x: 2.0, y: 1.0 },
                    { x: 1.0, y: 1.0 }
                ],
            },
            {
                text: 'Anchor Line',
                boundingPolygon: [
                    { x: 2.5, y: 1.0 },
                    { x: 3.5, y: 1.0 },
                    { x: 3.5, y: 2.0 },
                    { x: 2.5, y: 2.0 }
                ],
            },
            {
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 2.5 },
                    { x: 4.0, y: 2.5 },
                    { x: 4.0, y: 3.0 },
                    { x: 3.0, y: 3.0 }
                ],
            },
        ]
    };

    const anchorLine = { 
        text: 'Anchor Line',
        boundingPolygon: [
            { x: 2.5, y: 1.0 },
            { x: 3.5, y: 1.0 },
            { x: 3.5, y: 2.0 },
            { x: 2.5, y: 2.0 }
        ],
    };

    it('should return lines positioned below the anchor line', () => {
        const result = filterPositionBelow(standardizedPage, anchorLine);
        expect(result).toEqual([
            {
                text: 'Line 2',
                boundingPolygon: [
                    { x: 3.0, y: 2.5 },
                    { x: 4.0, y: 2.5 },
                    { x: 4.0, y: 3.0 },
                    { x: 3.0, y: 3.0 }
                ],
            },
        ]);
    });

    it('should return an empty array if no lines are positioned below the anchor line', () => {
        const result = filterPositionBelow(standardizedPage, {
            text: 'Anchor Line',
            boundingPolygon: [
                { x: 1.0, y: 3.0 },
                { x: 2.0, y: 3.0 },
                { x: 2.0, y: 4.0 },
                { x: 1.0, y: 4.0 }
            ],
        });
        expect(result).toEqual([]);
    });
});

describe('extractLabel', () => {
    const configuration: Label = {
      id: "label",
      position: "below",
      textAlignment: "left",
      anchor: "Distance"
    }

    it('should return the adjacent line positioned below and left to the anchor line', () => {
        const result = extractLabel(configuration, standardizedText);
        expect(result).toEqual({
              text: "733mi",
              boundingPolygon: [
                {
                  "x": 2.005,
                  "y": 4.413
                },
                {
                  "x": 2.374,
                  "y": 4.413
                },
                {
                  "x": 2.374,
                  "y": 4.541
                },
                {
                  "x": 2.005,
                  "y": 4.541
                }
              ]
        });
    });

    it('should return null if the anchor line is not found', () => {
        const invalidConfiguration: Label = {
            id: 'label',
            position: 'above',
            textAlignment: 'right',
            anchor: 'Nonexistent'
        };
        const result = extractLabel(invalidConfiguration, standardizedText);
        expect(result).toBeNull();
    });

    it('should return null if the adjacent line is not found', () => {
        const invalidConfiguration: Label = {
            id: 'label',
            position: 'above',
            textAlignment: 'left',
            anchor: 'freight-carrier@uber.com'
        };
        const result = extractLabel(invalidConfiguration, standardizedText);
        expect(result).toBeNull();
    });
});

describe('extractRow', () => {
    const configuration: Row = {
        id: 'row',
        position: 'right',
        tiebreaker: 1,
        anchor: 'Line Haul'
    };

    it('should return the correct standardized line when the anchor line and vertical line are found', () => {
        const result = extractRow(configuration, standardizedText);
        expect(result).toEqual({
            text: "$1770.00",
            boundingPolygon: [
              {
                "x": 6.765,
                "y": 1.994
              },
              {
                "x": 7.315,
                "y": 1.994
              },
              {
                "x": 7.315,
                "y": 2.122
              },
              {
                "x": 6.765,
                "y": 2.122
              }
            ]
          });
    });

    it('should return null when the anchor line is not found', () => {
        const invalidConfiguration: Row = {
            id: 'row',
            position: 'left',
            tiebreaker: 'last',
            anchor: 'Nonexistent'
        };
        const result = extractRow(invalidConfiguration, standardizedText);
        expect(result).toBeNull();
    });

    it('should return null when the vertical line is not found', () => {
        const invalidConfiguration: Row = {
            id: 'row',
            position: 'left',
            tiebreaker: 1,
            anchor: 'Rate confirmation'
        };
        const result = extractRow(invalidConfiguration, standardizedText);
        expect(result).toBeNull();
    });
});