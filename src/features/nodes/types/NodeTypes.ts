
export interface NodeData {
    id: string;
    title: string;
    description?: string;
    status: 'available' | 'completed';
    parents: string[];
    order_index?: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface TreeNode extends NodeData {
    x: number;
    y: number;
    parent?: TreeNode;
}

export interface TreeLink {
    source: TreeNode;
    target: TreeNode;
}
