import { QuadTree, AxisAlignedBoundingBox } from './quad-tree';

describe('QuadTree', () => {
    it('should match snapshot', () => {
        const qt = new QuadTree(new AxisAlignedBoundingBox({ x: 0, y: 0 }, { x: 0.5, y: 0.5 }));
        expect(qt).toMatchSnapshot();
    });
});
