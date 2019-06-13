export function setBackgroundColor(
  state: LayoutModule.ModuleState,
  color: string,
) {
  state.backgroundColor = color;
}

export function setFooterState(
  state: LayoutModule.ModuleState,
  footerState: LayoutModule.props.footerState,
) {
  state.footerState = footerState;
}

export function toggleStickyHeader(
  state: LayoutModule.ModuleState,
) {
  state.stickyHeader = !state.stickyHeader;
}