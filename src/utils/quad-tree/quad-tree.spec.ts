import { AABB } from 'utils/aabb';
import { Point } from 'utils/point';

import { QuadTree } from './quad-tree';

describe('QuadTree', () => {
    it('should match snapshot', () => {
        const qt = new QuadTree(new AABB(new Point(1, 1), new Point(1, 1)));

        qt.insert(new Point(0.25, 0.1));
        qt.insert(new Point(0.25, 0.2));
        qt.insert(new Point(0.25, 0.3));
        qt.insert(new Point(0.25, 0.4));
        qt.insert(new Point(0.25, 0.5));

        expect(qt).toMatchSnapshot();
    });
});
