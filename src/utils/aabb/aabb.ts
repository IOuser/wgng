import { IPoint, Point } from 'utils/point';

import { TFullDimensions } from './tdimensions';

export const enum AABBPart {
    NW,
    NE,
    SW,
    SE,
}

// AxisAlignedBoundingBox
export interface IAABB {
    containsPoint(point: IPoint): boolean;
    intersectsAABB(other: IAABB): boolean;
    subdivide(part: AABBPart): IAABB;
    fullDimensions(): TFullDimensions;
}

export class AABB implements IAABB {
    private _center: IPoint;
    private _halfDimension: IPoint;

    public constructor(center: IPoint, halfDimension: IPoint) {
        this._center = center;
        this._halfDimension = halfDimension;
    }

    public containsPoint(point: IPoint): boolean {
        const { x, y } = point;

        const left = this._center.x - this._halfDimension.x;
        const right = this._center.x + this._halfDimension.x;
        const top = this._center.y - this._halfDimension.y;
        const bottom = this._center.y + this._halfDimension.y;

        return !(x < left || x > right || y < top || y > bottom);
    }

    public intersectsAABB(aabb: IAABB): boolean {
        const aDims = this.fullDimensions();
        const bDims = aabb.fullDimensions();

        const aLeft = aDims.x;
        const aRight = aDims.x + aDims.width;
        const aTop = aDims.y;
        const aBottom = aDims.y + aDims.height;

        const bLeft = bDims.x;
        const bRight = bDims.x + bDims.width;
        const bTop = bDims.y;
        const bBottom = bDims.y + bDims.height;

        if (aLeft > bRight || aRight < bLeft || aTop > bBottom || aBottom < bTop) {
            return false;
        }

        return true;
    }

    public subdivide(part: AABBPart): IAABB {
        const { x, y } = this._center;
        const { x: halfW, y: halfY } = this._halfDimension;
        const quadW = halfW / 2;
        const quadH = halfY / 2;
        const halfDimension = new Point(quadW, quadH);

        switch (true) {
            case part === AABBPart.NW:
                return new AABB(new Point(x - quadW, y - quadH), halfDimension);
            case part === AABBPart.NE:
                return new AABB(new Point(x + quadW, y - quadH), halfDimension);
            case part === AABBPart.SW:
                return new AABB(new Point(x - quadW, y + quadH), halfDimension);
            case part === AABBPart.SE:
                return new AABB(new Point(x + quadW, y + quadH), halfDimension);
            default:
                throw Error('Part have incorrect value');
        }
    }

    public fullDimensions(): TFullDimensions {
        const { x, y } = this._center;
        const { x: halfW, y: halfY } = this._halfDimension;
        return {
            x: x - halfW,
            y: y - halfY,
            width: halfW * 2,
            height: halfY * 2,
        };
    }
}
