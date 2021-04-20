// @ts-ignore
import {task} from 'gulp';
import {DIST_ROOT} from '../constants';
// @ts-ignore
import {cleanTask} from '../util/task_helpers';


/** Deletes the dist/ directory. */
task('clean', cleanTask(DIST_ROOT));
