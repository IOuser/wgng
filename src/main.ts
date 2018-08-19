import * as ng from './ng';

ng.f();

if (module.hot) {
    module.hot.accept('./ng', () => {
        console.log('Accepting the updated printMe module!');
        ng.f();
    });
}
