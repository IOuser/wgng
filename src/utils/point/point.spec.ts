import { Point } from './point';

describe('Point::distance', () => {
    it('should calc distance between two points (xy)', () => {
        const p1 = new Point(0, 0);
        const p2 = new Point(3, 4);

        expect(p1.distance(p2)).toBe(5);
    });

    it('should calc distance between two equal points', () => {
        const p1 = new Point(0, 0);
        const p2 = new Point(0, 0);

        expect(p1.distance(p2)).toBe(0);
    });
});
