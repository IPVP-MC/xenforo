var eles = document.getElementsByClassName("fa");
var res = "";
var count = 0;
var classes = [];
for (var i = 0, len = eles.length; i < len; i++){
	var className = eles[i].className;
	var canAdd = true;
	for (var j = 0, len2 = classes.length; j < len2; j++){
		if (className == classes[j]) {
			canAdd = false;
			break;
		}
	}
	if (canAdd && className.split("fa").length == 3){
		res = (res == "") ? className : res + "," + className;
		classes.push(className);
		count++;
	}
}