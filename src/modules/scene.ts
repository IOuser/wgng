import { IDestroyable } from 'utils/idestroyable';
import { Dimensions } from 'utils/aabb/dimensions';
import { QuadTree } from 'utils/quad-tree';
import { IPoint, Point } from 'utils/point/point';
import { AABB } from 'utils/aabb/aabb';

// x, y, w, h
export type TViewport = [number, number, number, number];

export type SceneParams = {
    dimensions: Dimensions;
};

export class Scene implements IDestroyable {
    private _invalidated: boolean = true;

    private _params: SceneParams;
    private _viewport: TViewport;
    // private _entities: any[] = [];

    private _entities: IPoint[] = [];
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

        const [x, y, w, h] = this._viewport;

        ctx.save();
        ctx.fillStyle = '#f3f';
        const or = this._updateTree.outerRange(new AABB(new Point(x + w / 2, y + h / 2), new Point(w / 2, h / 2)));
        for (const e of or) {
            // ctx.fillRect(Math.round(e.x), Math.round(e.y), 1, 1);
            ctx.fillRect(Math.round(e.x - 1), Math.round(e.y - 1), 2, 2);
        }
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#ff3';
        const qr = this._updateTree.queryRange(new AABB(new Point(x + w / 2, y + h / 2), new Point(w / 2, h / 2)));
        for (const e of qr) {
            ctx.fillRect(Math.round(e.x - 1), Math.round(e.y - 1), 2, 2);
        }
        ctx.restore();

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(...this._viewport);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.25)';
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
        const aabb = new AABB(new Point(width / 2, height / 2), new Point(width / 2, height / 2));
        return new QuadTree(aabb);
    }

    private _insertEntitiesToUpdateTree(): void {
        for (const entity of this._entities) {
            this._updateTree.insert(entity);
        }
    }

    private _generateEntities(): void {
        for (let i = 0; i < 5000; i++) {
            const x = r(0, this._params.dimensions.width);
            const y = r(0, this._params.dimensions.height);

            this._entities.push(new Point(x, y));
        }

        this._insertEntitiesToUpdateTree();
    }
}

const r = (min: number, max: number) => Math.random() * (max - min) + min;
