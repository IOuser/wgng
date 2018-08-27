import { IPoint } from 'utils/point';
import { IAABB, AABBPart } from 'utils/aabb';

const enum Constants {
    NodeCapacity = 4,
}

export class QuadTree {
    private _boundary: IAABB;
    private _points: IPoint[] = [];

    private _northWest: QuadTree | null = null;
    private _northEast: QuadTree | null = null;
    private _southWest: QuadTree | null = null;
    private _southEast: QuadTree | null = null;

    public constructor(boundary: IAABB) {
        this._boundary = boundary;
    }

    public renderNodes(ctx: CanvasRenderingContext2D): void {
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        if (this._northWest === null) {
            const { x, y, width, height } = this._boundary.fullDimensions();
            ctx.strokeRect(x, y, width, height);
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

    public queryRange(range: IAABB): IPoint[] {
        // debugger
        const result: IPoint[] = [];

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

    public outerRange(range: IAABB): IPoint[] {
        const result: IPoint[] = [];

        // Add "isSubBound" method to AABB
        // if (this._boundary.intersectsAABB(range)) {
        //     return result;
        // }

        for (const point of this._points) {
            if (!range.containsPoint(point)) {
                result.push(point);
            }
        }

        if (this._northWest === null) {
            return result;
        }

        return [
            ...result,
            ...this._northWest!.outerRange(range),
            ...this._northEast!.outerRange(range),
            ...this._southWest!.outerRange(range),
            ...this._southEast!.outerRange(range),
        ];
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public insert(point: IPoint): boolean {
        if (!this._boundary.containsPoint(point)) {
            return false;
        }

        if (this._points.length < Constants.NodeCapacity) {
            this._points.push(point);
            return true;
        }

        if (
            this._northWest === null ||
            this._northEast === null ||
            this._southWest === null ||
            this._southEast === null
        ) {
            this._northWest = new QuadTree(this._boundary.subdivide(AABBPart.NW));
            this._northEast = new QuadTree(this._boundary.subdivide(AABBPart.NE));
            this._southWest = new QuadTree(this._boundary.subdivide(AABBPart.SW));
            this._southEast = new QuadTree(this._boundary.subdivide(AABBPart.SE));
        }

        const points = this._points;
        while (points.length) {
            const currentPoint = points.shift();
            if (currentPoint === undefined) {
                break;
            }

            if (
                this._northWest.insert(currentPoint) ||
                this._northEast.insert(currentPoint) ||
                this._southWest.insert(currentPoint) ||
                this._southEast.insert(currentPoint)
            ) {
                continue;
            }

            throw Error('Wrong sub tree range');
        }

        return (
            this._northWest.insert(point) ||
            this._northEast.insert(point) ||
            this._southWest.insert(point) ||
            this._southEast.insert(point)
        );
    }
}
