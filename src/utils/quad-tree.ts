export type XY = {
    x: number;
    y: number;
};

export const enum AABBPart {
    NW,
    NE,
    SW,
    SE,
}

export interface AABB {
    containsPoint(point: XY): boolean;
    intersectsAABB(other: AABB): boolean;
    subdivide(part: AABBPart): AABB;
    dims(): [number, number, number, number];
}

export class AxisAlignedBoundingBox implements AABB {
    private _center: XY;
    private _halfDimension: XY;

    public constructor(center: XY, halfDimension: XY) {
        this._center = center;
        this._halfDimension = halfDimension;
    }

    public containsPoint(point: XY): boolean {
        const { x, y } = point;

        const left = this._center.x - this._halfDimension.x;
        const right = this._center.x + this._halfDimension.x;
        const top = this._center.y - this._halfDimension.y;
        const bottom = this._center.y + this._halfDimension.y;

        return !(x < left || x > right || y < top || y > bottom);
    }

    public intersectsAABB(_aabb: AABB): boolean {
        return true;
    }

    public subdivide(part: AABBPart): AABB {
        const { x, y } = this._center;
        const { x: halfW, y: halfY } = this._halfDimension;
        const quadW = halfW / 2;
        const quadH = halfY / 2;
        const halfDimension = { x: quadW, y: quadH };

        switch (true) {
            case part === AABBPart.NW:
                return new AxisAlignedBoundingBox({ x: x - quadW, y: y - quadH }, halfDimension);
            case part === AABBPart.NE:
                return new AxisAlignedBoundingBox({ x: x + quadW, y: y - quadH }, halfDimension);
            case part === AABBPart.SW:
                return new AxisAlignedBoundingBox({ x: x - quadW, y: y + quadH }, halfDimension);
            case part === AABBPart.SE:
                return new AxisAlignedBoundingBox({ x: x + quadW, y: y + quadH }, halfDimension);
            default:
                throw Error('Part have incorrect value');
        }
    }

    public dims(): [number, number, number, number] {
        const { x, y } = this._center;
        const { x: halfW, y: halfY } = this._halfDimension;
        return [x - halfW, y - halfY, halfW * 2, halfY * 2];
    }
}

const enum Constants {
    QT_NODE_CAPACITY = 4,
}

export class QuadTree {
    private _boundary: AABB;
    private _points: XY[] = [];

    private _northWest: QuadTree | null = null;
    private _northEast: QuadTree | null = null;
    private _southWest: QuadTree | null = null;
    private _southEast: QuadTree | null = null;

    public constructor(boundary: AABB) {
        this._boundary = boundary;
    }

    public renderNodes(ctx: CanvasRenderingContext2D): void {
        if (this._northWest === null) {
            ctx.strokeRect(...this._boundary.dims());
            return;
        }

        this._northWest!.renderNodes(ctx);
        this._northEast!.renderNodes(ctx);
        this._southWest!.renderNodes(ctx);
        this._southEast!.renderNodes(ctx);
    }

    public reset(): void {
        this._points = [];
        this._northWest = null;
        this._northEast = null;
        this._southWest = null;
        this._southEast = null;
    }

    public queryRange(range: AABB): XY[] {
        // debugger
        const result: XY[] = [];

        if (!this._boundary.intersectsAABB(range)) {
            return result;
        }

        for (const point of this._points) {
            if (range.containsPoint(point)) {
                result.push(point);
            }
        }

        if (this._northWest === null) {
            return result;
        }

        return [
            ...result,
            ...this._northWest!.queryRange(range),
            ...this._northEast!.queryRange(range),
            ...this._southWest!.queryRange(range),
            ...this._southEast!.queryRange(range),
        ];
    }

    public insert(point: XY): boolean {
        if (!this._boundary.containsPoint(point)) {
            return false;
        }

        if (this._points.length < Constants.QT_NODE_CAPACITY) {
            this._points.push(point);
            return true;
        }

        if (this._northWest === null) {
            return this._subdivide(point);
        }

        // TODO: Add tests
        throw Error('waat');
        return false;
    }

    private _subdivide(newPoint: XY): boolean {
        this._northWest = new QuadTree(this._boundary.subdivide(AABBPart.NW));
        this._northEast = new QuadTree(this._boundary.subdivide(AABBPart.NE));
        this._southWest = new QuadTree(this._boundary.subdivide(AABBPart.SW));
        this._southEast = new QuadTree(this._boundary.subdivide(AABBPart.SE));

        for (const point of this._points) {
            if (
                this._northWest.insert(point) ||
                this._northEast.insert(point) ||
                this._southWest.insert(point) ||
                this._southEast.insert(point)
            ) {
                continue;
            }

            throw Error('Wrong sub tree range');
        }

        return (
            this._northWest.insert(newPoint) ||
            this._northEast.insert(newPoint) ||
            this._southWest.insert(newPoint) ||
            this._southEast.insert(newPoint)
        );
    }
}
