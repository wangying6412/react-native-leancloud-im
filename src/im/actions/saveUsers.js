
import { createAction } from 'redux-actions';
import types from './types';

/**
 * action creator - 保存用户
 *
 * @function module:actions#saveUser
 * @param {Object} user - 用户对象
 * @example
 *
 * dispatch(saveUser(user))
 */
export const saveUser = createAction(types.IM_SAVE_USER);


/**
 * action creator - 保存用户(复数)
 *
 * @function module:actions#saveUsers
 * @param {Array} users - 用户对象数组
 * @example
 *
 * dispatch(saveUsers(users))
 */
export const saveUsers = createAction(types.IM_SAVE_USERS);

