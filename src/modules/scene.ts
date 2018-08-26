import { IDestroyable } from 'utils/idestroyable';
import { TDimensions } from './tdimensions';
import { QuadTree, AxisAlignedBoundingBox, XY } from 'utils/quad-tree';

// x, y, w, h
export type TViewport = [number, number, number, number];

export type SceneParams = {
    dimensions: TDimensions;
};

export class Scene implements IDestroyable {
    private _invalidated: boolean = true;

    private _params: SceneParams;
    private _viewport: TViewport;
    // private _entities: any[] = [];

    private _entities: XY[] = [];
    private _updateTree: QuadTree;

    public constructor(params: SceneParams) {
        this._params = params;
        this._viewport = this._calcViewport();
        this._updateTree = this._initUpdateTree();
        this._generateEntities();
    }

    public destroy(): void {
        //
    }

    public update(): void {
        this._invalidated = true;
    }

    public setParams(params: SceneParams): void {
        this._params = params;
        this.update();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (this._invalidated) {
            this._updateImpl();
        }

        ctx.save();

        ctx.save();
        ctx.fillStyle = 'white';
        for (const e of this._entities) {
            ctx.fillRect(e.x, e.y, 1, 1);
        }
        ctx.restore();

        const [x, y, w, h] = this._viewport;

        ctx.save();
        ctx.fillStyle = 'blue';
        const ra = this._updateTree.queryRange(
            new AxisAlignedBoundingBox({ x: x + w / 2, y: y + h / 2 }, { x: w / 2, y: h / 2 }),
        );
        for (const e of ra) {
            ctx.fillRect(e.x - 2, e.y - 2, 4, 4);
        }
        ctx.restore();

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(...this._viewport);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this._updateTree.renderNodes(ctx);

        ctx.restore();
    }

    private _updateImpl(): void {
        this._viewport = this._calcViewport();
        this._updateTree = this._initUpdateTree();
        this._insertEntitiesToUpdateTree();
    }

    private _calcViewport(): TViewport {
        const {
            dimensions: { width, height },
        } = this._params;

        const fifthW = width / 5;
        const fifthH = height / 5;
        return [fifthW, fifthH, width - fifthW * 2, height - fifthH * 2];
    }

    private _initUpdateTree(): QuadTree {
        const {
            dimensions: { width, height },
        } = this._params;
        const aabb = new AxisAlignedBoundingBox({ x: width / 2, y: height / 2 }, { x: width / 2, y: height / 2 });
        return new QuadTree(aabb);
    }

    private _insertEntitiesToUpdateTree(): void {
        for (const entity of this._entities) {
            this._updateTree.insert(entity);
        }
    }

    private _generateEntities(): void {
        for (let i = 0; i < 10000; i++) {
            const x = r(0, this._params.dimensions.width);
            const y = r(0, this._params.dimensions.height);

            this._entities.push({ x, y });
        }

        this._insertEntitiesToUpdateTree();
    }
}

const r = (min: number, max: number) => Math.random() * (max - min) + min;
