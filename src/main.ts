import { WGNG } from './ng';
import { Keyboard } from './controllers/keyboard';

const { width, height } = document.body.getBoundingClientRect();
const el = document.createElement('canvas');
el.width = width;
el.height = height;
document.body.appendChild(el);

let kb = new Keyboard();
let instance = new WGNG({ canvas: el });
instance.start();
instance.addController('keyboard', kb);

if (module.hot) {
    module.hot.accept('./ng', () => {
        console.log('Accepting the updated printMe module!');
        instance.destroy();
        instance = new WGNG({ canvas: el });
        instance.start();
        instance.addController('keyboard', kb);
    });

    module.hot.accept('./controllers/keyboard', () => {
        kb.destroy();
        kb = new Keyboard();
        instance.addController('keyboard', kb);
    });
}
