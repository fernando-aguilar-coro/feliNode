# Nodes Feature (Curriculum Tree)

This module visualizes the learning path as an interactive node graph.

## Data Structure: DAG (Directed Acyclic Graph)

We use a **Many-to-Many** relationship to support complex learning dependencies (e.g., a node requiring multiple prerequisites).

> [!NOTE]
> **Strict Tree vs DAG**: While `d3.tree` is designed for strict hierarchies, we adapt it to display DAGs. A node with multiple parents is processed by the layout engine multiple times, but we **deduplicate** it in `NodeService.ts` to render a single visual node with converging connections.

### Schema
*   **`lessons`**: Stores lesson metadata.
*   **`lesson_dependencies`**: Junction table `(lesson_id, prerequisite_id)`.

## Architecture

1.  **Data Layer (`hooks/useNodes.ts`)**:
    *   Fetches lessons joins them with their parents from `lesson_dependencies`.

2.  **Layout Layer (`services/NodeService.ts`)**:
    *   **Inversion**: Converts `Parent -> Children` adjacency list for D3.
    *   **Virtual Root**: Handles multiple entry points (roots).
    *   **Deduplication**: Merges multiple instances of the same node (due to multiple parents) into one visual coordinate, creating the cross-linked effect.

3.  **Visualization (`components/TreeCanvas.tsx`)**:
    *   **SVG Rendering**: Uses `react-native-svg` to draw lines and nodes.

## Customization

### Changing the Layout Algorithm
*   **Cluster vs Tree**: Change `d3.tree()` to `d3.cluster()` in `NodeService` to push leaf nodes to the end.
*   **Radial**: Use `size([2 * Math.PI, radius])` and map polar coordinates to Cartesian for a circular tree.

### Visual Styling
*   **Nodes**: Edit `src/features/nodes/components/NodeContent.tsx`.
*   **Links**: Edit `src/features/nodes/components/LinkLine.tsx`.
