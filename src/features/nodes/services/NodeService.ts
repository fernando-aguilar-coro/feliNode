import * as d3 from 'd3-hierarchy';
import { getLessonNodes } from '../../../db_local/api_local';
import { TreeNode, TreeLink } from '../types/NodeTypes';

export const NodeService = {
    /**
     * Fetches lessons from the database and calculates their positions in a tree layout.
     * Uses d3.stratify() since the DB now provides a strict parent_id relationship.
     */
    async getLayout(width: number = 400, height: number = 600): Promise<{ nodes: TreeNode[], links: TreeLink[] }> {
        const allLessons = await getLessonNodes();
        // Filter out placement_test from the tree view
        const lessons = allLessons;

        if (lessons.length === 0) {
            return { nodes: [], links: [] };
        }

        try {
            // 1. Build Adjacency List (Parent -> Children)
            // The API returns lessons with 'parents' array. We need to invert this for d3.hierarchy.
            const childrenMap = new Map<string, string[]>();
            const lessonMap = new Map<string, any>();

            lessons.forEach(l => {
                lessonMap.set(l.id, l);
                l.parents.forEach(pId => {
                    if (!childrenMap.has(pId)) childrenMap.set(pId, []);
                    childrenMap.get(pId)?.push(l.id);
                });
            });

            // 2. Find Roots (Lessons with no parents)
            const roots = lessons.filter(l => l.parents.length === 0);

            // 3. Create Hierarchical Data
            // We use a virtual root to handle multiple real roots
            const virtualRoot = { id: 'virtual-root', isVirtual: true };

            // Custom hierarchy traverser
            const hierarchy = d3.hierarchy(virtualRoot, (d: any) => {
                if (d.isVirtual) return roots; // Virtual root returns actual roots
                // For a lesson, return its children from the map
                const childIds = childrenMap.get(d.id);
                return childIds ? childIds.map(id => lessonMap.get(id)) : null;
            });

            // 4. Calculate Layout
            const LEVEL_HEIGHT = 160; // Distance between levels
            const TOP_PADDING = 100;  // Padding from the top of the canvas

            const treeLayout = d3.tree<any>()
                .size([width, height]); // We still use size for horizontal distribution, but we'll override Y

            const rootWithPositions = treeLayout(hierarchy);

            // 5. Deduplicate Nodes (DAG Handling) and Adjust Vertical Position
            const uniqueNodesMap = new Map<string, TreeNode>();

            rootWithPositions.descendants().forEach(d => {
                if (d.data.isVirtual) return;

                if (!uniqueNodesMap.has(d.data.id)) {
                    // We override d.y with a fixed vertical step based on depth
                    // Depth 1 (actual roots) will be at TOP_PADDING
                    // Depth 2 at TOP_PADDING + LEVEL_HEIGHT, etc.
                    const nodeY = (d.depth - 1) * LEVEL_HEIGHT + TOP_PADDING;

                    uniqueNodesMap.set(d.data.id, {
                        ...d.data,
                        x: d.x,
                        y: nodeY,
                    });
                }
            });

            const positionedNodes = Array.from(uniqueNodesMap.values());

            // 6. Reconstruct Links
            // We want links from ALL parents to the unique child node.
            // d3 links connect the duplicated nodes. We remap them to the unique nodes.
            const links: TreeLink[] = [];

            rootWithPositions.links().forEach(link => {
                if (link.source.data.isVirtual || link.target.data.isVirtual) return;

                const sourceNode = uniqueNodesMap.get(link.source.data.id);
                const targetNode = uniqueNodesMap.get(link.target.data.id);

                if (sourceNode && targetNode) {
                    links.push({
                        source: sourceNode,
                        target: targetNode
                    });
                }
            });

            return { nodes: positionedNodes, links };

        } catch (e) {
            console.error('Failed to calculate DAG layout:', e);
            return { nodes: [], links: [] };
        }
    }
};
