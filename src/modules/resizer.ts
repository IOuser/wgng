import { IDestroyable } from 'utils/idestroyable';
import { IDelegate, Delegate } from 'utils/delegate';
import { debounce } from 'utils/debounce';

import { TDimensions } from 'utils/aabb/tdimensions';

export class Resizer implements IDestroyable {
    private _resizeHandler: IDelegate<TDimensions> = new Delegate();
    private _onResizeDebounced: () => void = debounce(this._onResize.bind(this), 100);
    private _dimensions: TDimensions = this._getDimensions();

    public constructor() {
        this._addListeners();
    }

    public destroy(): void {
        this._removeListeners();
        this._resizeHandler.destroy();
    }

    public getResizeHandler(): IDelegate<TDimensions> {
        return this._resizeHandler;
    }

    public getDimensions(): TDimensions {
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

    private _getDimensions(): TDimensions {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
}
