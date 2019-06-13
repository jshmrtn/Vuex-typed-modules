export function otherThings(state: LayoutModule.ModuleState) {
  return {
    footerState: state.footerState,
    stickyHeader: state.stickyHeader,
  };
}

export function backgroundColor(state: LayoutModule.ModuleState) {
  return state.backgroundColor;
}
