import { storeBuilder, prepareModules, getStoredModule, storeModule, deleteStoredModule } from './builder';

export function enableHotReload(path, state, vuexModule, dynamic?: boolean) {
  const name = path.join('/');
  if (module.hot) {
    const appliedModule = getStoredModule(path) as object | null;
    if (!appliedModule && !dynamic) {
      storeModule(path, state, vuexModule);
    } else if (appliedModule) {
      Object.assign(appliedModule, {
        namespaced: true,
        state,
        ...vuexModule,
      });

      storeBuilder.hotUpdate({
        modules: {
          ...prepareModules(),
        },
      });
      console.log(
        `%c vuex-typed-modules %c ${dynamic ? 'Dynamic' : ''}Module '${name}' hot reloaded %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#d64a17 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      );
    }
  }
}

export function disableHotReload(path) {
  deleteStoredModule(path);
  storeBuilder.hotUpdate({
    modules: {
      ...prepareModules(),
    },
  });
}
