function getDirStructure(dirs) {
    let dir = {};
    for (;;) {
        let next = dirs.shift()
        if (!next) break;
        if (next.lastIndexOf('/') > 0) {
            const parent = next.substring(1).split('/')[0];
            const child = next.substring(next.indexOf(parent) + parent.length);
            if (!dir[parent]) dir[parent] = {};
            dir[parent] = Object.assign(dir[parent], getDirStructure([child]));
        } else {
            dir[next.substring(1)] = {};
        }
    }
    return dir;
}

export {
    getDirStructure
};