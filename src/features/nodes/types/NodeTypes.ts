
export interface NodeData {
    id: string;
    title: string;
    description?: string;
    status: 'locked' | 'available' | 'completed';
    parents: string[];
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
