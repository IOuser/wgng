import { Keys } from 'utils/keys';
import { Controller } from './controller';

export class Keyboard extends Controller<Keys> {
    public constructor() {
        super();
        this._addListeners();
    }

    protected _addListeners(): void {
        window.addEventListener('keydown', this._downHandler);
        window.addEventListener('keyup', this._upHandler);
    }

    protected _removeListeners(): void {
        window.removeEventListener('keydown', this._downHandler);
        window.removeEventListener('keyup', this._upHandler);
    }

    private _downHandler = (e: KeyboardEvent) => {
        e.preventDefault();
        this._state[e.key as Keys] = true;
        console.log(this._state);
    };

    private _upHandler = (e: KeyboardEvent) => {
        this._state[e.key as Keys] = false;
        console.log(this._state);
    };
}
