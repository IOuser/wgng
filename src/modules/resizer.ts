import { IDestroyable } from 'utils/idestroyable';
import { IDelegate, Delegate } from 'utils/delegate';
import { debounce } from 'utils/debounce';

import { Dimensions } from 'utils/aabb/dimensions';

export class Resizer implements IDestroyable {
    private _resizeHandler: IDelegate<Dimensions> = new Delegate();
    private _onResizeDebounced: () => void = debounce(this._onResize.bind(this), 100);
    private _dimensions: Dimensions = this._getDimensions();

    public constructor() {
        this._addListeners();
    }

    public destroy(): void {
        this._removeListeners();
        this._resizeHandler.destroy();
    }

    public getResizeHandler(): IDelegate<Dimensions> {
        return this._resizeHandler;
    }

    public getDimensions(): Dimensions {
        return this._dimensions;
    }

    private _addListeners(): void {
        window.addEventListener('resize', this._onResizeDebounced);
    }

    private _removeListeners(): void {
        window.removeEventListener('resize', this._onResizeDebounced);
    }

    private _onResize(): void {
        const dimensions = this._getDimensions();
        this._dimensions = dimensions;
        this._resizeHandler.fire(dimensions);
    }

    private _getDimensions(): Dimensions {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
}
