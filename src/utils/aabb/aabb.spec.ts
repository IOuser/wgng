import { Point } from 'utils/point';

import { AABB, AABBPart } from './aabb';

describe('AABB', () => {
    const center = new Point(1, 1);
    const halfDimensions = new Point(1, 1);

    describe('::containsPoint', () => {
        it('should check is point inside bounds', () => {
            const aabb = new AABB(center, halfDimensions);

            // inside
            expect(aabb.containsPoint(new Point(1, 1))).toBeTruthy();
            expect(aabb.containsPoint(new Point(0.5, 0.5))).toBeTruthy();

            // outside
            expect(aabb.containsPoint(new Point(-1, -1))).toBeFalsy();

            // edge cases
            expect(aabb.containsPoint(new Point(0, 3))).toBeFalsy();
            expect(aabb.containsPoint(new Point(0, 2))).toBeTruthy();
            expect(aabb.containsPoint(new Point(0, 1))).toBeTruthy();
            expect(aabb.containsPoint(new Point(0, 0))).toBeTruthy();
            expect(aabb.containsPoint(new Point(3, 0))).toBeFalsy();
            expect(aabb.containsPoint(new Point(2, 0))).toBeTruthy();
            expect(aabb.containsPoint(new Point(1, 0))).toBeTruthy();
            expect(aabb.containsPoint(new Point(0, 0))).toBeTruthy();
        });
    });

    describe('::intersectsAABB', () => {
        it('should check is intersect other AABB', () => {
            const aabb = new AABB(center, halfDimensions);

            const aabb1 = new AABB(new Point(0, 1), halfDimensions);
            expect(aabb.intersectsAABB(aabb1)).toBeTruthy();

            const aabb2 = new AABB(new Point(0, 4), halfDimensions);
            expect(aabb.intersectsAABB(aabb2)).toBeFalsy();

            // Y edge cases
            const aabb3 = new AABB(new Point(0, 3), halfDimensions);
            expect(aabb.intersectsAABB(aabb3)).toBeTruthy();

            const aabb4 = new AABB(new Point(0, -1), halfDimensions);
            expect(aabb.intersectsAABB(aabb4)).toBeTruthy();

            // X edge cases
            const aabb5 = new AABB(new Point(3, 0), halfDimensions);
            expect(aabb.intersectsAABB(aabb5)).toBeTruthy();

            const aabb6 = new AABB(new Point(-1, 0), halfDimensions);
            expect(aabb.intersectsAABB(aabb6)).toBeTruthy();

            // XY edge cases
            const aabb7 = new AABB(new Point(-1, 3), halfDimensions);
            expect(aabb.intersectsAABB(aabb7)).toBeTruthy();

            const aabb8 = new AABB(new Point(3, 3), halfDimensions);
            expect(aabb.intersectsAABB(aabb8)).toBeTruthy();

            const aabb9 = new AABB(new Point(-1, -1), halfDimensions);
            expect(aabb.intersectsAABB(aabb9)).toBeTruthy();

            const aabb10 = new AABB(new Point(3, -1), halfDimensions);
            expect(aabb.intersectsAABB(aabb10)).toBeTruthy();
        });
    });

    describe('::subdivide', () => {
        const aabb = new AABB(center, halfDimensions);

        const dimensions = {
            width: 1,
            height: 1,
        };

        it('should subdivide to nw part', () => {
            const nw = aabb.subdivide(AABBPart.NW);
            expect(nw.fullDimensions()).toMatchObject({
                ...dimensions,
                x: 0,
                y: 0,
            });
        });

        it('should subdivide to ne part', () => {
            const ne = aabb.subdivide(AABBPart.NE);
            expect(ne.fullDimensions()).toMatchObject({
                ...dimensions,
                x: 1,
                y: 0,
            });
        });

        it('should subdivide to sw part', () => {
            const sw = aabb.subdivide(AABBPart.SW);
            expect(sw.fullDimensions()).toMatchObject({
                ...dimensions,
                x: 0,
                y: 1,
            });
        });

        it('should subdivide to se part', () => {
            const se = aabb.subdivide(AABBPart.SE);
            expect(se.fullDimensions()).toMatchObject({
                ...dimensions,
                x: 1,
                y: 1,
            });
        });
    });

    describe('::fullDimensions', () => {
        it('should normalize dimensions', () => {
            const aabb = new AABB(center, halfDimensions);
            expect(aabb.fullDimensions()).toMatchObject({
                x: 0,
                y: 0,
                width: 2,
                height: 2,
            });
        });
    });
});
