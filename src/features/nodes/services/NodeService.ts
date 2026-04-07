import dagre from 'dagre';
import { moduleRepository } from '../../../db_local/repositories';
import { TreeNode, TreeLink } from '../types/NodeTypes';

export const NodeService = {
    /**
     * Fetches modules from the database and calculates their positions using dagre for DAG layout.
     */
    async getLayout(width: number = 400, height: number = 600): Promise<{ nodes: TreeNode[], links: TreeLink[], width: number, height: number }> {
        const modules = await moduleRepository.getModuleNodes();

        if (modules.length === 0) {
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
            modules.forEach(module => {
                g.setNode(module.id, {
                    label: module.id,
                    width: 100, // Assumed width
                    height: 50,  // Assumed height
                    ...module
                });
            });

            // Add edges from the dependencies.
            modules.forEach(module => {
                if (module.parents && module.parents.length > 0) {
                    module.parents.forEach(parentId => {
                        // dagre expects (v, w) where v is the source and w is the target
                        // validation: ensure parent exists in modules to avoid graph errors
                        if (modules.find(m => m.id === parentId)) {
                            g.setEdge(parentId, module.id);
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

                // We map back to our TreeNode type.
                positionedNodes.push({
                    id: v,
                    ...node, // contains original module data + x, y from dagre
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
