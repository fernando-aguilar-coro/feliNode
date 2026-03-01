import dagre from 'dagre';
import { lessonRepository } from '../../../db_local/repositories';
import { TreeNode, TreeLink } from '../types/NodeTypes';

export const NodeService = {
    /**
     * Fetches lessons from the database and calculates their positions using dagre for DAG layout.
     */
    async getLayout(width: number = 400, height: number = 600): Promise<{ nodes: TreeNode[], links: TreeLink[], width: number, height: number }> {
        const lessons = await lessonRepository.getLessonNodes();

        if (lessons.length === 0) {
            return { nodes: [], links: [], width, height };
        }

        try {
            // Create a new directed graph
            const g = new dagre.graphlib.Graph();

            // Set an object for the graph label
            g.setGraph({
                rankdir: 'TB', // Top-to-Bottom
                marginx: 20,
                marginy: 20,
                nodesep: 50, // Horizontal separation between nodes
                ranksep: 100 // Vertical separation between ranks
            });

            // Default to assigning a new object as a label for each new edge.
            g.setDefaultEdgeLabel(function () { return {}; });

            // Add nodes to the graph. The first argument is the node id. The second is
            // metadata about the node. In this case we're going to add labels to each of our nodes.
            lessons.forEach(lesson => {
                g.setNode(lesson.id, {
                    label: lesson.id,
                    width: 100, // Assumed width
                    height: 50,  // Assumed height
                    ...lesson
                });
            });

            // Add edges to the graph.
            lessons.forEach(lesson => {
                if (lesson.parents && lesson.parents.length > 0) {
                    lesson.parents.forEach(parentId => {
                        // dagre expects (v, w) where v is the source and w is the target
                        // validation: ensure parent exists in lessons to avoid graph errors
                        if (lessons.find(l => l.id === parentId)) {
                            g.setEdge(parentId, lesson.id);
                        }
                    });
                }
            });

            // Calculate the layout
            dagre.layout(g);

            // Construct the result
            const positionedNodes: TreeNode[] = [];
            g.nodes().forEach(v => {
                const node = g.node(v) as any;
                // dagre returns center x, y. We might need top-left depending on rendering, 
                // but usually center is fine or we adjust. Let's return what dagre gives 
                // and assume the renderer handles it or we expect center.
                // d3 layout usually gave x,y.

                // We map back to our TreeNode type.
                // 'node' contains the properties we spread earlier (...lesson) + x, y from dagre.
                positionedNodes.push({
                    id: v,
                    ...node, // contains original lesson data + x, y
                    x: node.x,
                    y: node.y
                } as TreeNode);
            });

            const links: TreeLink[] = [];
            g.edges().forEach(e => {
                // e.v is source, e.w is target
                const sourceNode = positionedNodes.find(n => n.id === e.v);
                const targetNode = positionedNodes.find(n => n.id === e.w);

                if (sourceNode && targetNode) {
                    links.push({
                        source: sourceNode,
                        target: targetNode
                    });
                }
            });

            return {
                nodes: positionedNodes,
                links,
                width: g.graph().width || width,
                height: g.graph().height || height
            };

        } catch (e) {
            console.error('Failed to calculate DAG layout with dagre:', e);
            return { nodes: [], links: [], width, height };
        }
    }
};
