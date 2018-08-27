import { IDestroyable } from 'utils/idestroyable';
import { isString, isCanvasEl } from 'utils/typeguards';
import { Dimensions } from 'utils/aabb/dimensions';

export class Pane implements IDestroyable {
    private _canvasEl: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    public constructor(canvasElOrSelector: HTMLCanvasElement | string) {
        // Prepare canvas
        let canvasEl: HTMLCanvasElement | string | null = canvasElOrSelector;
        if (isString(canvasElOrSelector)) {
            canvasEl = document.querySelector<HTMLCanvasElement>(canvasElOrSelector);
        }

        if (!isCanvasEl(canvasEl)) {
            throw new Error('Canvas not founded');
        }

        this._canvasEl = canvasEl;

        // Prepare context
        const ctx = canvasEl.getContext('2d');
        if (ctx === null) {
            throw new Error('CTX not found');
        }

        this._ctx = ctx;
    }

    public destroy(): void {
        this._ctx.clearRect(0, 0, this._canvasEl.width, this._canvasEl.height);

        // this._canvasEl.remove();
    }

    public setSize({ width, height }: Dimensions): void {
        const el = this._canvasEl;
        el.width = width;
        el.height = height;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
    }

    public getContext(): CanvasRenderingContext2D {
        return this._ctx;
    }
}
