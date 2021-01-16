
export const appUrl = function(url){
	url = (url.charAt(0) === "/") ? url.slice(1) : url;
	let	cleanUrl = (url.charAt(url.length - 1) === "/") ? url.slice(0,url.length - 1) : url;
	cleanUrl = app_uri !== '' ? "/"+cleanUrl : cleanUrl;
	return window.location.origin+"/"+cleanUrl;
}

export const filterName = function(str){
	let validChr = [];
	str.split('').forEach(function(val){
		if (val.match(/[a-zA-Z]/)) {
			validChr.push(val);
		}
	});
	return (validChr.join("") === str) ? str : false;
}

export const validateEmail = function(email) {
	if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
		return email;
	}return false;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

export const objectToArray = function(obj){
	var array = Object.keys(obj).map(function(key) {
	 	return [key, obj[key]];
	});
	return array;
}

export const arrayToObject = function(array){
	var object = {};
	array.forEach(function(val){
		object[val[0]] = val[1];
	});
	return object;
}

export const htmlEntities = function(rawStr) {
	var encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&\"\'\/]/gim, function(i) {
	   return '&#'+i.charCodeAt(0)+';';
	});
	return encodedStr;
}

export const findAndReplace = function(str,obj,num=0) {
	var value,size;
	var array = objectToArray(obj);
	size = Object.size(array);
	value = array.shift();
	if(size > num){
		var regEx = new RegExp(value[0],"g");
		str = str.replace(regEx,value[1]);
		delete obj[value[0]];
		str = findAndReplace(str,obj,num++);
	}
	return str;
}


export const getPosition = function(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}


export const _calculateAge = function (dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const calculateInterest = function (total,year,rate) {
    var interest = rate/100+1;
    return parseFloat((total*Math.pow(interest,year)).toFixed(4));
}

export const getToken = function (){
	var meta = document.querySelectorAll('[name="csrf_token"]');
	if (meta.length > 0) {
		return meta[0].content;
	}
}

export const setToken = function (token){
	var meta = document.querySelectorAll('[name="csrf_token"]');
	if (meta.length > 0) {
		meta[0].setAttribute('content', token);
	}
}