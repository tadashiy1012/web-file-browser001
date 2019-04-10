import * as deepmerge from 'deepmerge';

function getDirStructure(dirs, path = '/') {
    let dir = [];
    for (;;) {
        let next = dirs.shift()
        if (!next) break;
        if (next.lastIndexOf('/') > 0) {
            const parent = next.substring(1).split('/')[0];
            const child = next.substring(next.indexOf(parent) + parent.length);
            const result = getDirStructure([child], path + parent + '/')[0];
            let tgt = dir.find(e => e.name === parent);
            if (tgt) {
                let ctgt = tgt.child.find(e => e.name === result.name);
                if (ctgt) {
                    const ctgtIdx = tgt.child.indexOf(ctgt);
                    const dupl = ctgt.child.filter(e => e.name === result.child[0].name);
                    if (dupl.length > 0) {
                        const uniq = ctgt.child.filter(e => e.name !== result.child[0].name);
                        ctgt.child = uniq;
                    }
                    let merged = deepmerge(ctgt, result);
                    tgt.child[ctgtIdx] = merged;
                } else {
                    tgt.child = [...tgt.child, result];
                }
            } else {
                dir.push({
                    path: path,
                    name: parent,
                    child: [result]
                });
            }
        } else {
            dir.push({
                path: path,
                name: next.substring(1),
                child: []
            });
        }
    }
    return dir;
}

export {
    getDirStructure,
};