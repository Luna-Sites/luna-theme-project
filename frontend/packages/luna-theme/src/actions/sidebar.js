/**
 * Luna Theme Sidebar actions.
 * @module actions/sidebar
 */

export const TOGGLE_SIDEBAR_VISIBILITY = 'TOGGLE_SIDEBAR_VISIBILITY';
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';

/**
 * Toggle sidebar visibility function.
 * @function toggleSidebarVisibility
 * @returns {Object} Toggle sidebar visibility action.
 */
export function toggleSidebarVisibility() {
  return {
    type: TOGGLE_SIDEBAR_VISIBILITY,
  };
}

/**
 * Set sidebar visibility function.
 * @function setSidebarVisibility
 * @param {Boolean} visible Whether sidebar should be visible.
 * @returns {Object} Set sidebar visibility action.
 */
export function setSidebarVisibility(visible) {
  return {
    type: SET_SIDEBAR_VISIBILITY,
    visible,
  };
}
