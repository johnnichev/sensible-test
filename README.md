
# Text Extraction Tool - Sensible Test

## Overview

This tool extracts text based on positional and alignment criteria from standardized text outputs, such as PDFs. It supports two main extraction methods: **Label Extraction** and **Row Extraction**, allowing users to specify an anchor and direction for precise text extraction.

## Setup

To set up the Text Extraction Tool, follow these steps:

1. **Ensure Node.js is Installed:**
   - Visit the [Node.js official website](https://nodejs.org/) and download the installer for your operating system. It's recommended to install the LTS version.
   - Follow the installation prompts to install Node.js and npm.
   - Verify the installation by running `node -v` and `npm -v` in your terminal or command prompt.

2. **Clone the Repository:**
   - Clone the project repository to your local machine using Git or download the ZIP file and extract it.

3. **Install Dependencies:**
   - Navigate to the project directory in your terminal or command prompt.
   - Run `npm install` to install the project's dependencies as listed in `package.json`. This command will install TypeScript, Jest for testing, and other necessary packages.

## Compile and Run

- **Compile TypeScript:**
  - The project uses TypeScript, which needs to be compiled to JavaScript before execution. You can compile the TypeScript files by running `npm run start`. This script compiles the TypeScript files and then executes the `dist/index.js` file.

- **Start the Application:**
  - Use the `npm start` command to compile TypeScript files and run the application. This command is defined in `package.json` under the `scripts` section and performs both compilation and execution in one step.

## Testing
- Run `npm test` to perform jest tests.

## Input Configuration

Edit `input.json` to switch between label and row extraction methods. The structure for each method is defined as follows:

### Label Extraction Type

```typescript
export interface Label {
  id: "label";
  position: "right" | "left" | "above" | "below";
  textAlignment: "right" | "left";
  anchor: string;
}
```

### Row Extraction Type

```typescript
export interface Row {
  id: "row";
  position: "right" | "left";
  tiebreaker: number | "last";
  anchor: string;
}
```

Example `input.json`:

```json
{
  "method": "label",
  "position": "above",
  "textAlignment": "left",
  "anchor": "Example Anchor"
}
```

## Types Explained

- **Label**: Targets text adjacent to an anchor.
- **Row**: Focuses on text at the same vertical level as the anchor.

## Functionality

- **Filtering**: Narrows down lines based on their spatial relation to the anchor.
- **Sorting**: Orders filtered lines by proximity to the anchor, considering alignment.
- **Extraction**: Returns the line that best matches the criteria.

Remember to adjust `input.json` for different documents and extraction needs.
