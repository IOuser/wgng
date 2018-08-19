import { IController, TControllerState } from './icontroller';
import { IDestroyable } from 'utils/idestroyable';

export abstract class Controller<K extends string> implements IController<K>, IDestroyable {
    protected _state: TControllerState<K> = {};

    public destroy(): void {
        this._removeListeners();
    }

    public isPressed(key: K): boolean {
        return Boolean(this._state[key]);
    }

    protected abstract _addListeners(): void;

    protected abstract _removeListeners(): void;
}
