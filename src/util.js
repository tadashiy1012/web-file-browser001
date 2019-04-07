import * as deepmerge from 'deepmerge';

function getDirStructure(dirs) {
    let dir = {};
    for (;;) {
        let next = dirs.shift()
        if (!next) break;
        if (next.lastIndexOf('/') > 0) {
            const parent = next.substring(1).split('/')[0];
            const child = next.substring(next.indexOf(parent) + parent.length);
            const result = getDirStructure([child]);
            if (!dir[parent]) {
                dir[parent] = result;
            } else {
                dir[parent] = deepmerge(dir[parent], result);
            }
        } else {
            dir[next.substring(1)] = {};
        }
    }
    return dir;
}

export {
    getDirStructure
};