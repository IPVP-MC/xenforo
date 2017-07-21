
var uix = uix || {};

uix.pfLog = false;

uix.tStamp = function (label, level, startTime) {
    if (uix.pfLog && startTime !== null) console.log(label + ": " + uix.round(uix.time() - startTime, 5) + " ms");
}

uix.round = function(num, points){
    return Math.round(num * Math.pow(10, points)) / Math.pow(10, points);
}

uix.time = function(force){
    if (force || uix.pfLog) {
        if (typeof(window.performance) === "undefined") return Date.now();
        return window.performance.now ? (performance.now() + performance.timing.navigationStart) : Date.now();
    }
    return null;
}

uix.admin = uix.admin || {};

uix.admin.nodeTree = uix.admin.nodeTree || {
    tree: null,
    branches: [],

    init: function(){
        var tree = $('ol.FilterList.Scrollable'),
            branches = $('li.listItem', tree);
        uix.admin.nodeTree.tree = tree;
        for (var i = 0, len = branches.length; i < len; i++){
            var ele = branches[i],
                classSplit = ele.className.split(" "),
                depth = 0,
                parent = 0;
            
            for (var j = 0, len2 = classSplit.length; j < len2; j++){
                if (classSplit[j].indexOf("_depth") !== -1){
                    depth = parseInt(classSplit[j].replace("_depth", ""));
                    break;
                }
            }

            if (depth > 0) {
                for (var j = (i - 1); j >= 0; j--){
                    if (uix.admin.nodeTree.branches[j].depth == depth - 1){
                        parent = uix.admin.nodeTree.branches[j].nodeID
                        break;
                    }
                }
            }

            var branch = {
                    index: i,
                    ele: ele,
                    nodeID: ele.id.replace("_", ""),
                    depth: depth,
                    parent: parent,
                    order: 10 * (i + 1),
                }
            uix.admin.nodeTree.branches.push(branch);
        }

        tree.html(uix.admin.nodeTree.recurse(0));
        
        var sortable = tree.nestedSortable({
            handle: 'div .uix_nodeTreeHandle',
            items: 'li.uix_nodeTreeBranch',
            toleranceElement: '> div',
            opacity: .6,
            isTree: true,
            tabSize: 30,
            update: function () {
                uix.admin.nodeTree.update();
            },
        });

        uix.admin.nodeTree.update();
    },

    recurse: function(parent){
        var ret = "",
            arr = uix.admin.nodeTree.branches,
            index = -1;
        for (var i = 0, len = arr.length; i < len; i++){
            var ele = arr[i];
            if (ele.parent == parent){
                ret += uix.admin.nodeTree.recurse(ele.nodeID);
            } else if (ele.nodeID == parent){
                index = i
            }
        }
        if (index == -1){
            return ret
        }
    
        return "<li id='uix_node" + arr[index].nodeID + "' class='uix_nodeTreeBranch'>\n" + ("~|~" + arr[index].ele.outerHTML.replace("<em>", "<em><span class='uix_nodeTreeHandle'> </span>") + "~|~").replace("</li>~|~", "</div>").replace("~|~<li", "<div") + "\n<ol>\n" + ret + "\n</ol>\n</li>\n"
    },

    update: function(){
        var nodeTree = uix.admin.nodeTree.tree.nestedSortable('toArray', {startDepthCount: 0});

        for (var i = 0, len = uix.admin.nodeTree.branches.length; i < len; i++){
            uix.admin.nodeTree.branches[i].ele = document.getElementById("_" + uix.admin.nodeTree.branches[i].nodeID);

            var branch = uix.admin.nodeTree.branches[i],
                classSplit = branch.ele.className.split(" "),
                newClasses = "",
                treeID = -1;

            for (var j = 0, len2 = nodeTree.length; j < len2; j++){
                if (nodeTree[j].item_id == "node" + branch.nodeID){
                    treeID = j;
                    break;
                }
            }

            uix.admin.nodeTree.branches[i].depth = nodeTree[treeID].depth - 1;
            uix.admin.nodeTree.branches[i].parent = (nodeTree[treeID].parent_id === null) ? 0 : parseInt(nodeTree[treeID].parent_id.replace("node", "")) || 0;
            uix.admin.nodeTree.branches[i].order = treeID * 10;


            for (var j = 0, len2 = classSplit.length; j < len2; j++){
                if (classSplit[j].indexOf("_depth") !== -1){
                    newClasses += "_depth" + branch.depth + " ";
                } else {
                    newClasses += classSplit[j] + " ";
                }
            }

            branch.ele.className = newClasses;
            document.getElementById("parent_node_id" + branch.nodeID).value = branch.parent;
            document.getElementById("display_order_node" + branch.nodeID).value = branch.order;
        }
    },

}

$(document).ready(function() {
    var pfTime = uix.time();
    uix.admin.nodeTree.init();

   uix.tStamp("UIX Node Tree", 0, pfTime);
});