/**
 * Luna Theme Sidebar visibility reducer.
 * @module reducers/sidebarVisibility
 */

import {
  TOGGLE_SIDEBAR_VISIBILITY,
  SET_SIDEBAR_VISIBILITY,
} from 'luna-theme/actions/sidebar';

const initialState = {
  visible: true, // Sidebar is visible by default in edit mode
};

/**
 * Sidebar visibility reducer.
 * @function sidebarVisibility
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function sidebarVisibility(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_SIDEBAR_VISIBILITY:
      return {
        ...state,
        visible: !state.visible,
      };
    case SET_SIDEBAR_VISIBILITY:
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
}
