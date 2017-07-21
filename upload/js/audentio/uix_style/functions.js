var audentio;
if (audentio === undefined) {
	audentio = {};
}

// #######################################################################################
// #																					 #
// #									UIX Check Radius								 #
// #																					 #
// #######################################################################################

uix.checkRadius = {
	elms: ['#logoBlock .pageContent', '#content .pageContent', '#userBar .pageContent', '#navigation .pageContent', '.footer .pageContent', '.bigFooter .pageContent', '.footerLegal .pageContent'],
	elmInfo: [],
	needsInit: true,
	wrapperTop: null,
	needsCheck: false,
	uixWrapper: null,
	running: false,

	init: function() {
		var uc = uix.checkRadius;
		uc.initGet();
		uc.initSet();
	},

	initGet: function() {
		var uc = uix.checkRadius;
		uix.checkRadius.running = true;

		/* Target elements to run tests against */
		for (var i = 0, len = uc.elms.length; i < len; i++) {
			var elementSelector = uc.elms[i],
				element = $(elementSelector),
				eleLength = element.length;
			if (eleLength) {
				var newEle = {
					element: element,
					length: eleLength,
					lastClass: '',
					fullWidth: false,
					height: -1,
					topOffset: -1,
					topRadius: true,
					bottomRadius: true
				};

				uix.checkRadius.elmInfo.push(newEle);
			}
		}

		uix.checkRadius.uixWrapper = $('#uix_wrapper');

		uc.resize();

		uc.checkGet(true);
	},

	initSet: function() {
		var uc = uix.checkRadius;

		uix.checkRadius.needsInit = false;

		uc.checkSet(true);
	},

	resize: function() {
		uix.checkRadius.wrapperTop = uix.checkRadius.uixWrapper.get(0).getBoundingClientRect().top + uix.scrollTop;
	},

	get: function(checkWidth) {
		if (checkWidth !== true) {
			checkWidth = false;
		}

		var uc = uix.checkRadius,
			wrapperTop = uc.wrapperTop,
			windowWidth = (checkWidth) ? uix.windowWidth : 0;

		var elmInfoLen = uc.elmInfo.length;

		for (var i = 0; i < elmInfoLen; i++) {
			var elm = uc.elmInfo[i].element.get(0);
			if (checkWidth) {
				uix.checkRadius.elmInfo[i].width = elm.offsetWidth;
			}
			uix.checkRadius.elmInfo[i].height = elm.offsetHeight;
			uix.checkRadius.elmInfo[i].topOffset = elm.getBoundingClientRect().top + uix.scrollTop;
			uix.checkRadius.elmInfo[i].topRadius = true;
			uix.checkRadius.elmInfo[i].bottomRadius = true;
		}
	},

	set: function(checkWidth) {
		if (checkWidth !== true) {
			checkWidth = false;
		}

		var uc = uix.checkRadius,
			wrapperTop = uc.wrapperTop,
			windowWidth = (checkWidth) ? uix.windowWidth : 0;

		var elmInfoLen = uc.elmInfo.length;

		for (var i = 0; i < elmInfoLen; i++) { // Loop through all
			var elmI = uc.elmInfo[i];
			if (elmI.length) {
				if (checkWidth && elmI.width == windowWidth) { //Reset border-radius if element is full width
					uix.checkRadius.elmInfo[i].topRadius = false;
					uix.checkRadius.elmInfo[i].bottomRadius = false;
					uix.checkRadius.elmInfo[i].fullWidth = true;
				} else if (elmI.fullWidth) {
					uix.checkRadius.elmInfo[i].topRadius = false;
					uix.checkRadius.elmInfo[i].bottomRadius = false;
				} else {
					for (var x = 0; x < elmInfoLen; x++) { // Check if our element is touching other elms[]
						var elmX = uc.elmInfo[x];

						if (x != i) { // Dont check against itself
							if (elmX.length) {
								if (Math.abs(elmI.topOffset - (elmX.topOffset + elmX.height)) < 1) {
									uix.checkRadius.elmInfo[i].topRadius = false; // attached top
								}
								if (Math.abs((elmI.topOffset + elmI.height) - elmX.topOffset) < 1) {
									uix.checkRadius.elmInfo[i].bottomRadius = false; // attached bottom
								}
							}
						}
					}
				}

				var newClass = 'defaultBorderRadius';
				if (elmI.topRadius === false && elmI.bottomRadius === false) {
					newClass = 'noBorderRadius';
				} else if (elmI.topRadius === false) {
					newClass = 'noBorderRadiusTop';
				} else if (elmI.bottomRadius === false) {
					newClass = 'noBorderRadiusBottom';
				}

				if (newClass != elmI.lastClass) {
					elmI.element.addClass(newClass).removeClass(elmI.lastClass);
					uix.checkRadius.elmInfo[i].lastClass = newClass;
				}
			}
		}
		if (uc.needsCheck) {
			uix.checkRadius.needsCheck = false;
		}
	},

	scheduleCheck: function() {
		uix.checkRadius.needsCheck = true;
	},

	check: function(checkWidth) {
		var uc = uix.checkRadius,
			pfTime = uix.time();

		uc.checkGet(checkWidth);
		uc.checkSet(checkWidth);

		uix.tStamp('UIX.checkRadius.check', 2, pfTime);
	},

	checkGet: function(checkWidth) {
		var uc = uix.checkRadius,
			pfTime = uix.time();

		if (uc.running) {
			if (checkWidth !== true) {
				checkWidth = false;
			}
			uc.get(checkWidth);
		}

		uix.tStamp('UIX.checkRadius.checkGet', 2, pfTime);
	},

	checkSet: function(checkWidth) {
		var uc = uix.checkRadius,
			pfTime = uix.time();

		if (uc.running) {
			if (checkWidth !== true) {
				checkWidth = false;
			}
			uc.set(checkWidth);
		}

		uix.tStamp('UIX.checkRadius.checkSet', 2, pfTime);
	}
};

// #######################################################################################
// #																					 #
// #							 UIX Collapsible Functions								 #
// #																					 #
// #######################################################################################

uix.collapsible = {
	items: [],
	needsInit: true,

	nextItemNum: function() {
		return uix.collapsible.items.length;
	},

	init: function() {
		var uc = uix.collapsible;
		uc.initGet();
		uc.initSet();
	},

	initGet: function() {
		var changeMade = false;
		if (uix.collapsibleNodes) {
			var eles = document.getElementsByClassName('node category level_1'),
				colDefaultArray = uix.collapsedNodesDefault.split(','),
				colNodesCookie = $.getCookie('uix_collapsedNodes'),
				colNodesArray = (colNodesCookie === null) ? [] : colNodesCookie.split(','),
				expNodesCookie = $.getCookie('uix_expandedNodes'),
				expNodesArray = (expNodesCookie === null) ? [] : expNodesCookie.split(',');

			for (var i = 0, len = eles.length; i < len; i++) {
				(function(i) {
					var trigger = eles[i].getElementsByClassName('js-collapseNodeTrigger'),
						ele = eles[i],
						eleClass = ele.className,
						eleClassSplit = eleClass.split(' '),
						label = '',
						defaultVal = true,
						itemState = 1,
						defaultCollapsed = false,
						j,
						len2;

					for (j = 0, len2 = eleClassSplit.length; j < len2; j++) {
						if (eleClassSplit[j].indexOf('node_') > -1) {
							label = eleClassSplit[j];
							break;
						}
					}

					if (label !== '') {
						for (j = 0, len2 = colDefaultArray.length; j < len2; j++) {
							if (label == colDefaultArray[j]) {
								itemState = 0;
								defaultCollapsed = true;
								break;
							}
						}
						for (j = 0, len2 = colNodesArray.length; j < len2; j++) {
							if (label == colNodesArray[j]) {
								itemState = 0;
								defaultVal = false;
								break;
							}
						}
						if (itemState === 0) {
							for (j = 0, len2 = expNodesArray.length; j < len2; j++) {
								if (label == expNodesArray[j]) {
									itemState = 1;
									defaultVal = false;
									break;
								}
							}
						}

						var item = {
								ele: ele,
								child: ele.getElementsByClassName('nodeList')[0],
								state: itemState,
								enabled: 1,
								index: i,
								defaultVal: defaultVal,
								defaultCollapsed: defaultCollapsed,
								label: label,
								type: 'node',
								icon: ele.getElementsByClassName('js-collapseIcon')[0],
								trigger: (trigger.length === 1) ? trigger[0] : null
							};

						if (item.trigger !== null) {
							item.trigger.addEventListener('click',
								function(e) {
									e.preventDefault();
									uix.collapsible.toggle(i);
									return false;
								},
								false
							);
						}

						uix.collapsible.items.push(item);
					}
				}) (i);
			}
		}

		if (uix.collapsibleSticky) {
			var stickyThreads = $('.uix_stickyThreadWrapper');
			if (stickyThreads.length) {
				var nextNum = uix.collapsible.nextItemNum(),
					ele = stickyThreads[0],
					trigger = stickyThreads[0].getElementsByClassName('js-collapseNodeTrigger'),
					defaultVal = true,
					itemState = !uix.user.stickyThreadsState,
					defaultCollapsed = false,
					label = '';

				var item = {
						ele: ele,
						child: ele.getElementsByClassName('uix_stickyThreads')[0],
						state: itemState,
						enabled: 1,
						index: nextNum,
						defaultVal: defaultVal,
						defaultCollapsed: defaultCollapsed,
						label: label,
						type: 'stickyThread',
						icon: ele.getElementsByClassName('js-collapseIcon')[0],
						trigger: (trigger.length === 1) ? trigger[0] : null
					};

				if (item.trigger !== null) {
					item.trigger.addEventListener('click',
						function(e) {
							e.preventDefault();
							uix.collapsible.toggle(nextNum);

							var xmlhttp = new XMLHttpRequest();
							xmlhttp.onreadystatechange = function() {
								if (xmlhttp.readyState == 4) {
									if (xmlhttp.status == 200) {
										content = xmlhttp.responseText;
									}
								}
							};

							if (item.state) {
								xmlhttp.open('GET', uix.ajaxStickyThreadExpandLink, true);
							} else {
								xmlhttp.open('GET', uix.ajaxStickyThreadCollapseLink, true);
							}

							xmlhttp.send();
							return false;
						},
						false
					);
				}

				uix.collapsible.items.push(item);
			}
		}
		if (changeMade && uix.sidebarSticky.running) {
			uix.sidebarSticky.resize();
		}
		uix.collapsible.needsInit = false;
	},

	initSet: function() {
		var changeMade = false;
		for (var i = 0, len = uix.collapsible.items.length; i < len; i++) {
			if (uix.collapsible.items[i].state === 0) {
				uix.collapsible.collapse(i, false);
				changeMade = true;
			} else if (uix.collapsible.items[i].state == 1) {
				uix.collapsible.expand(i, false);
			}
		}
		if (changeMade && uix.sidebarSticky.running) {
			uix.sidebarSticky.resize();
		}
	},

	toggle: function(i) {
		var item = uix.collapsible.items[i];
		if (item.state == 1) {
			uix.collapsible.collapse(i, true);
		} else {
			uix.collapsible.expand(i, true);
		}
	},

	collapse: function(i, setCookie) {
		uix.collapsible.items[i].state = 0;
		if (uix.collapsible.items[i].type == 'stickyThread') {
			$(uix.collapsible.items[i].child).slideUp(400, function() {
				//if (uix.isSet(uix.collapsible.items[i].child)) uix.collapsible.items[i].child.style.display = '';
			});
		} else {
			if (setCookie) {
				if (uix.sidebarSticky.running) {
					var stickyUpdate = window.setInterval(function() {
						uix.sidebarSticky.resize();
					}, 16);
				}
				if (uix.isSet(uix.collapsible.items[i].child)) {
					$(uix.collapsible.items[i].child).slideUp(400, function() {
						if (uix.sidebarSticky.running) {
							window.clearInterval(stickyUpdate);
							if (!uix.collapsible.needsInit) {
								uix.sidebarSticky.resize();
							}
						}
					});
				}
				uix.collapsible.items[i].defaultVal = false;
				uix.collapsible.updateCookie();
			} else {
				if (uix.isSet(uix.collapsible.items[i].child)) {
					uix.collapsible.items[i].child.style.display = 'none';
				}
			}
		}
		uix.collapsible.setIcon(uix.collapsible.items[i].icon, 1);
		uix.collapsible.items[i].ele.className += ' collapsed';
	},

	expand: function(i, setCookie) {
		uix.collapsible.items[i].state = 1;
		if (uix.collapsible.items[i].type == 'stickyThread') {
			window.requestAnimationFrame(function() {
				$(uix.collapsible.items[i].child).slideDown(400, function() {
					if (uix.isSet(uix.collapsible.items[i].child)) {
						uix.collapsible.items[i].child.style.display = 'block';
					}
				});
			});
		} else {
			if (setCookie) {
				if (uix.sidebarSticky.running) {
					var stickyUpdate = window.setInterval(function() {
						uix.sidebarSticky.resize();
					}, 16);
				}
				if (uix.isSet(uix.collapsible.items[i].child)) {
					$(uix.collapsible.items[i].child).slideDown(400, function() {
						if (uix.sidebarSticky.running) {
							window.clearInterval(stickyUpdate);
							if (!uix.collapsible.needsInit) {
								uix.sidebarSticky.resize();
							}
						}
					});
				}
				uix.collapsible.items[i].defaultVal = false;
				uix.collapsible.updateCookie();
			} else {
				if (uix.isSet(uix.collapsible.items[i].child)) {
					uix.collapsible.items[i].child.style.display = '';
				}
			}
		}
		uix.collapsible.setIcon(uix.collapsible.items[i].icon, 0);
		uix.collapsible.items[i].ele.className = uix.replace(uix.collapsible.items[i].ele.className, ' collapsed', '');
	},

	setIcon: function(ele, state) {
		if (uix.isSet(ele)) {
			if (state == 1) {
				ele.className = uix.replace(ele.className, 'uix_icon-collapse', 'uix_icon-expand');
			} else {
				ele.className = uix.replace(ele.className, 'uix_icon-expand', 'uix_icon-collapse');
			}
		}
	},

	updateCookie: function() {
		var retCol = '';
		var retExp = '';
		for (var i = 0, len = uix.collapsible.items.length; i < len; i++) {
			var item = uix.collapsible.items[i];
			if (item.defaultVal === false) {
				if (item.state === 0 && !item.defaultCollapsed) {
					retCol += item.label + ',';
				} else if (item.state == 1) {
					retExp += item.label + ',';
				}
			}
		}
		$.setCookie('uix_collapsedNodes', retCol, new Date(new Date().setYear(new Date().getFullYear() + 5)));
		$.setCookie('uix_expandedNodes', retExp, new Date(new Date().setYear(new Date().getFullYear() + 5)));
	},

	resetCookies: function() {
		$.setCookie('uix_collapsedNodes', '');
		$.setCookie('uix_expandedNodes', '');
	}
};

uix.dateHelper = {
	items: [],
	phrase: {
		now: 'now',
		second: 's',
		minute: 'm',
		hour: 'h',
		day: 'd',
		week: 'w',
		year: 'y',
		century: 'c',
		ago: '{time} ago'
	},
	seconds: {
		second: 1,
		minute: 60,
		hour: 3600,
		day: 86400,
		week: 604800,
		year: 31557600, // 365.25 days, accounts for leap year
		century: 3155760000
	},
	units: ['second', 'minute', 'hour', 'day', 'week', 'year', 'century'],
	nowTime: 9, // anything less than or equal to this number of seconds will say 'now'
	limitUnits: true, // if true, will only output 2 largest units
	showMinuteSeconds: false,

	initGet: function() {
		var ud = uix.dateHelper,
			eles = document.getElementsByClassName('uix_DateTime');

		for (var i = 0, len = eles.length; i < len; i++) {
			var canAdd = true;
			for (var itemIndex = 0, itemLen = ud.items.length; itemIndex < itemLen; itemIndex++) {
				if (ud.items[itemIndex] == eles[i]) {
					canAdd = false;
				}
			}

			if (canAdd) {
				var itemTime = eles[i].getAttribute('data-time'),
					interval = ud.makeInterval(eles[i], itemTime),
					item = {
						ele: eles[i],
						tStart: itemTime,
						interval: interval
					};

				if (itemTime > 0) {
					uix.dateHelper.items.push(item);
				}
			}
		}
	},

	initSet: function() {
		var ud = uix.dateHelper,
			hidden,
			visibilityChange;
		for (var i = 0, len = ud.items.length; i < len; i++) {
			var item = ud.items[i];
			ud.updateEle(item.ele, item.tStart);
		}

		if (uix.isSet(document.hidden)) { // Opera 12.10 and Firefox 18 and later support
			hidden = 'hidden';
			visibilityChange = 'visibilitychange';
		} else if (uix.isSet(document.mozHidden)) {
			hidden = 'mozHidden';
			visibilityChange = 'mozvisibilitychange';
		} else if (uix.isSet(document.msHidden)) {
			hidden = 'msHidden';
			visibilityChange = 'msvisibilitychange';
		} else if (uix.isSet(document.webkitHidden)) {
			hidden = 'webkitHidden';
			visibilityChange = 'webkitvisibilitychange';
		}

		if (uix.isSet(document.addEventListener) && uix.isSet(document[hidden])) {
			document.addEventListener(visibilityChange, function() {
				var itemIndex,
					itemLen = ud.items.length;
				if (document[hidden]) {
					for (itemIndex = 0; itemIndex < itemLen; itemIndex++) {
						window.clearInterval(ud.items[itemIndex].interval);
					}
				} else {
					for (itemIndex = 0; itemIndex < itemLen; itemIndex++) {
						uix.dateHelper.items[itemIndex].interval = ud.makeInterval(ud.items[itemIndex].ele, ud.items[itemIndex].tStart);
					}
				}
			}, false);
		}
	},

	makeInterval: function(ele, tStart) {
		var ud = uix.dateHelper,
			hasSeconds = ud.updateEle(ele, tStart),
			interval = '',
			intervalTime = 60000;

		if (hasSeconds) {
			intervalTime = 1000;
		}

		interval = (function(ele, tStart, intervalTime) {
			return window.setInterval(function() {
				if (uix.initDone) {
					var hasSeconds = ud.updateEle(ele, tStart);

					if (!hasSeconds && intervalTime === 1000) { // change to not counting every second if no longer has seconds
						for (var i = 0, len = uix.dateHelper.items.length; i < len; i++) {
							var item = uix.dateHelper.items[i];
							if (ele == item.ele) {
								window.clearInterval(item.interval); // Kyler, this isn't working yet, also add in phrases
								break;
							}
						}
						ud.makeInterval(ele, tStart);
					}
				}
			}, intervalTime);
		}) (ele, tStart, intervalTime);

		return interval;
	},

	init: function() {
		var ud = uix.dateHelper;
		ud.initGet();
		ud.initSet();
	},

	updateEle: function(ele, tStart) {
		var ud = uix.dateHelper,
			tDiff = ud.timeDiff(tStart);

		ele.innerHTML = tDiff.string;

		return tDiff.hasSeconds;
	},

	findUnits: function(tStamp) {
		var ud = uix.dateHelper,
			ret = {};
		for (var i = ud.units.length - 1; i >= 0; i--) {
			var unit = ud.units[i];
			if (tStamp >= ud.seconds[unit]) {
				var primary = Math.floor(tStamp / ud.seconds[unit]);
				ret[unit] = primary;

				if (ud.limitUnits) {
					if (i > 0) {
						tStamp = tStamp - (primary * ud.seconds[unit]);
						var secondary = Math.floor(tStamp / ud.seconds[ud.units[i - 1]]);
						ret[ud.units[i - 1]] = secondary;
					}
					return ret;
				} else {
					tStamp = tStamp - (primary * ud.seconds[unit]);
				}
			}
		}

		return ret;
	},

	makeString: function(tStamp) {
		var ud = uix.dateHelper,
			units = ud.findUnits(tStamp),
			ret = '',
			hasSeconds = false,
			isNow = false;

		for (var i = ud.units.length - 1; i >= 0; i--) {
			var unit = ud.units[i],
				num = units[unit];

			if (num > 0) {
				if (i === 0) {
					if (units[ud.units[i + 1]] > 0) {
						if (ud.showMinuteSeconds) {
							ret = ud.addUnit(num, unit, ret);
							hasSeconds = true;
						}
					} else {
						if (num <= ud.nowTime) {
							ret = ud.addUnit(num, 'now', ret);
							isNow = true;
						} else {
							ret = ud.addUnit(num, unit, ret);
						}
						hasSeconds = true;
					}
				} else {
					if (i === 1 && ud.showMinuteSeconds) {
						hasSeconds = true; // still update every second when even minute
					}
					ret = ud.addUnit(num, unit, ret);
				}
			}
		}

		if (!isNow) {
			ret = ud.processPhrase(ret);
		}

		if (ret === '') {
			ret = 'Error';
		}

		return {string: ret, hasSeconds: hasSeconds};
	},

	addUnit: function(num, unit, str) {
		var ud = uix.dateHelper;
		if (str !== '') {
			str += ' ';
		}

		if (unit == 'now') {
			str += ud.phrase.now;
		} else {
			str += num + ud.phrase[unit];
		}
		return str;
	},

	processPhrase: function(str) {
		var ud = uix.dateHelper;
		if (ud.phrase.ago.indexOf('{time}') > -1) {
			return ud.phrase.ago.replace('{time}', str);
		} else {
			return str;
		}
	},

	timeDiff: function(tStart) {
		var now = Math.floor(Date.now() / 1000);
		return uix.dateHelper.makeString(now - tStart);
	}
};

// #######################################################################################
// #																					 #
// #								 UI.X Debug Functions								 #
// #																					 #
// #######################################################################################
// Used to get times for UI.X initialization and basic information, even outside of beta mode.

//custom logger: logs only under Beta mode
uix.log = function(x, style) {
	if (!uix.isSet(style)) {
		if (uix.betaMode) {
			console.log(x);
		}
	} else {
		if (uix.betaMode) {
			console.log('%c' + x, style);
		}
	}
};

uix.info = function(x) {
	if (uix.betaMode) {
		console.info(x);
	}
};

uix.debug = function(skipMarks) {
	console.log(uix.initTime);
	console.log(uix.xfTime);
	var result = '===========================================================================\n';
	var numLength = 10,
		nameLength = 46,
		totalLength = 14,
		durationLength = 14,
		relativeLength = 14,
		timePoints = 3,
		i,
		len;

	if (skipMarks !== true) {
		result += '\n\n############============   Begin Copying Here   ============############\n\n';
	}
	result += uix.xfTime + '\n';
	result += '\n';

	result += 'User Settings: \n';
	if (uix.isSet(uix.user)) {
		var userKeys = Object.keys(uix.user);
		for (i = 0, len = userKeys.length; i < len; i++) {
			result += uix.logVar(uix.user[userKeys[i]], userKeys[i]);
		}
	} else {
		result += 'User settings not found.	There\'s likely an issue with the page_container_js_head template. \n';
	}
	result += uix.logVar(uix.toggleWidth.state, 'Current Width Toggle Setting');
	result += uix.logVar(XenForo.visitor.user_id, 'User ID');
	result += uix.logVar(XenForo.RTL, 'RTL');
	result += '\n';

	result += 'Page Settings: \n';
	result += uix.logVar(uix.contentTemplate, 'Content Template');
	result += uix.logVar(window.location.href, 'Current Page');
	result += uix.logVar(XenForo.baseUrl(), 'XenForo Address');
	result += '\n';

	result += 'Board Settings: \n';
	result += uix.logVar(uix.version, 'UI.X Version');
	result += uix.logVar(uix.jsVersion, 'UI.X Javascript Version');
	result += uix.logVar(uix.jsHeadVersion, 'UI.X js_head Version');
	result += uix.logVar(uix.addonVersion, 'UI.X Addon Version');
	result += uix.logVar(uix.betaMode, 'Beta Mode');
	result += uix.logVar(uix.jsGlobal, 'Javascript Global');
	result += uix.logVar(uix.jsPathUsed, 'Javascript Path Used');
	result += '\n';

	result += 'Device Settings: \n';
	result += uix.logVar(navigator.userAgent, 'Browser');
	result += uix.logVar('(' + window.screen.availWidth + ', ' + window.screen.availHeight + ')', 'Screen size (width, height)');
	result += uix.logVar('(' + window.innerWidth + ', ' + window.innerHeight + ')', 'Window size (width, height)');
	result += uix.logVar(uix.landscapeOrientation, 'Landscape Orientation');
	result += '\n';

	result += 'General Variables: \n';
	result += uix.logVar(uix.globalPadding, 'uix.globalPadding');
	result += uix.logVar(uix.sidebarWidth, 'uix.sidebarWidth');
	result += uix.logVar(uix.mainContainerMargin, 'uix.mainContainerMargin');
	result += uix.logVar(uix.jumpToFixedDelayHide, 'uix.jumpToFixedDelayHide');
	result += uix.logVar(uix.nodeStyle, 'uix.nodeStyle');
	result += uix.logVar(uix.pageStyle, 'uix.pageStyle');
	result += uix.logVar(uix.searchMinimalSize, 'uix.searchMinimalSize');
	result += uix.logVar(uix.searchPosition, 'uix.searchPosition');
	result += uix.logVar(uix.enableBorderCheck, 'uix.enableBorderCheck');
	result += uix.logVar(uix.enableULManager, 'uix.enableULManager');
	result += uix.logVar(uix.reinsertWelcomeBlock, 'uix.reinsertWelcomeBlock');
	result += uix.logVar(uix.cookiePrefix, 'uix.cookiePrefix');
	result += uix.logVar(uix.collapsedNodesDefault, 'uix.collapsedNodesDefault');
	result += uix.logVar(uix.widthToggleUpper, 'uix.widthToggleUpper');
	result += uix.logVar(uix.widthToggleLower, 'uix.widthToggleLower');
	result += uix.logVar(uix.toggleWidthEnabled, 'uix.toggleWidthEnabled');
	result += uix.logVar(uix.toggleWidthBreakpoint, 'uix.toggleWidthBreakpoint');
	result += uix.logVar(uix.collapsibleNodes, 'uix.collapsibleNodes');
	result += uix.logVar(uix.collapsibleSticky, 'uix.collapsibleSticky');
	result += uix.logVar(uix.ajaxWidthToggleLink, 'uix.ajaxWidthToggleLink');
	result += uix.logVar(uix.ajaxStickyThreadToggleLink, 'uix.ajaxStickyThreadToggleLink');
	result += uix.logVar(uix.ajaxSidebarToggleLink, 'uix.ajaxSidebarToggleLink');
	result += uix.logVar(uix.threadSlidingGlobalEnable, 'uix.threadSlidingGlobalEnable');
	result += uix.logVar(uix.threadSlidingAvatar, 'uix.threadSlidingAvatar');
	result += uix.logVar(uix.threadSlidingExtra, 'uix.threadSlidingExtra');
	result += uix.logVar(uix.threadSlidingHover, 'uix.threadSlidingHover');
	result += uix.logVar(uix.threadSlidingStaffShow, 'uix.threadSlidingStaffShow');
	result += uix.logVar(uix.signatureHidingEnabled, 'uix.signatureHidingEnabled');
	result += uix.logVar(uix.signatureHidingEnabledAddon, 'uix.signatureHidingEnabledAddon');
	result += uix.logVar(uix.signatureMaxHeight, 'uix.signatureMaxHeight');
	result += uix.logVar(uix.signatureHoverEnabled, 'uix.signatureHoverEnabled');
	result += uix.logVar(audentio.grid.debug, 'audentio.grid.debug');
	result += '\n';

	result += 'Sticky Variables: \n';
	result += uix.logVar(uix.stickyNavigationMinWidth, 'uix.stickyNavigationMinWidth');
	result += uix.logVar(uix.stickyNavigationMinHeight, 'uix.stickyNavigationMinHeight');
	result += uix.logVar(uix.stickyNavigationMaxWidth, 'uix.stickyNavigationMaxWidth');
	result += uix.logVar(uix.stickyNavigationMaxHeight, 'uix.stickyNavigationMaxHeight');
	result += uix.logVar(uix.stickyNavigationPortraitMinWidth, 'uix.stickyNavigationPortraitMinWidth');
	result += uix.logVar(uix.stickyNavigationPortraitMinHeight, 'uix.stickyNavigationPortraitMinHeight');
	result += uix.logVar(uix.stickyNavigationPortraitMaxWidth, 'uix.stickyNavigationPortraitMaxWidth');
	result += uix.logVar(uix.stickyNavigationPortraitMaxHeight, 'uix.stickyNavigationPortraitMaxHeight');
	result += uix.logVar(uix.stickyGlobalMinimumPosition, 'uix.stickyGlobalMinimumPosition');
	result += uix.logVar(uix.stickyGlobalScrollUp, 'uix.stickyGlobalScrollUp');
	result += uix.logVar(uix.stickyDisableIOSThirdParty, 'uix.stickyDisableIOSThirdParty');
	result += uix.logVar(uix.enableStickyFooter, 'uix.enableStickyFooter');
	result += uix.logVar(uix.stickyFooterBottomOffset, 'uix.stickyFooterBottomOffset');
	result += uix.logVar(uix.preventAlwaysSticky, 'uix.preventAlwaysSticky');
	result += uix.logVar(uix.stickySidebarDelayInit, 'uix.stickySidebarDelayInit');
	result += '\n';

	result += 'Responsive Breakpoint Variables: \n';
	result += uix.logVar(uix.maxResponsiveWideWidth, 'uix.maxResponsiveWideWidth');
	result += uix.logVar(uix.maxResponsiveMediumWidth, 'uix.maxResponsiveMediumWidth');
	result += uix.logVar(uix.maxResponsiveNarrowWidth, 'uix.maxResponsiveNarrowWidth');
	result += uix.logVar(uix.sidebarMaxResponsiveWidth, 'uix.sidebarMaxResponsiveWidth');
	result += uix.logVar(uix.responsiveMessageBreakpoint, 'uix.responsiveMessageBreakpoint');
	result += '\n';

	result += 'Sidebar and Offcanvas Variables: \n';
	result += uix.logVar(uix.sidebarMaxResponsiveWidthStr, 'uix.sidebarMaxResponsiveWidthStr');
	result += uix.logVar(uix.offCanvasLeftTriggerWidth, 'uix.offCanvasLeftTriggerWidth');
	result += uix.logVar(uix.offCanvasRightTriggerWidth, 'uix.offCanvasRightTriggerWidth');
	result += uix.logVar(uix.offCanvasNavTriggerWidth, 'uix.offCanvasNavTriggerWidth');
	result += uix.logVar(uix.offCanvasVisitorTriggerWidth, 'uix.offCanvasVisitorTriggerWidth');
	result += uix.logVar(uix.offcanvasTriggerAnimationDuration, 'uix.offcanvasTriggerAnimationDuration');
	result += uix.logVar(uix.offCanvasSidebar, 'uix.offCanvasSidebar');
	result += uix.logVar(uix.offCanvasSidebarVisitorTabs, 'uix.offCanvasSidebarVisitorTabs');
	result += uix.logVar(uix.offcanvasLeftStatic, 'uix.offcanvasLeftStatic');
	result += uix.logVar(uix.offcanvasRightStatic, 'uix.offcanvasRightStatic');
	result += uix.logVar(uix.offcanvasLeftStaticBreakpoint, 'uix.offcanvasLeftStaticBreakpoint');
	result += uix.logVar(uix.offcanvasRightStaticBreakpoint, 'uix.offcanvasRightStaticBreakpoint');
	result += uix.logVar(uix.sidebarLocation, 'uix.sidebarLocation');
	result += uix.logVar(uix.collapsibleSidebar, 'uix.collapsibleSidebar');
	result += uix.logVar(uix.sidebarInnerFloat, 'uix.sidebarInnerFloat');
	result += '\n';

	result += 'Initialization Timing: \n';
	result += '	' + uix.spaceToLength('', numLength) + uix.spaceToLength('Description', nameLength) + uix.spaceToLength('Total (ms)', totalLength) + uix.spaceToLength('Duration (ms)', durationLength)  + uix.spaceToLength('Relative (%)', relativeLength);
	if (uix.isSet(uix.initLog)) {
		for (i = 0, len = uix.initLog.length; i < len; i++) {
			var index = i + 1;
			if (index >= len) {
				index = 0;
			}
			result = result + '\n	' + uix.spaceToLength((i + 1).toString() + ':', numLength);
			result += uix.spaceToLength(uix.initLog[i][0], nameLength);
			result += uix.spaceToLength(uix.round(uix.initLog[i][1], timePoints).toString(), totalLength);
			if (i < (len - 1)) {
				result += uix.spaceToLength(uix.round(Math.abs(uix.initLog[index][1] - uix.initLog[i][1]), timePoints).toString(), durationLength);
				result += uix.spaceToLength(uix.round(((Math.abs(uix.initLog[index][1] - uix.initLog[i][1])) / uix.initLog[uix.initLog.length - 1][1]) * 100, timePoints).toString(), relativeLength);
			}
		}
	} else {
		result += 'No uix.initLog created. \n';
	}
	if (skipMarks !== true) {
		result += '\n\n############============   End Copying Here   ============############\n\n';
	}

	console.log(result);
	uix.pfLog = true;
	uix.betaMode = true;
};

uix.logVar = function(name, str) {
	ret = '';
	if (uix.isSet(name)) {
		ret = '-' + uix.spaceToLength(str, 40) + ': ' + name + '\n';
	}
	return ret;
};

uix.logI = function(label) {
	uix.tStamp(label, 0, uix.pfTime);
	uix.initLog.push([label, (uix.time(true) - uix.pfTime)]);
};

uix.spaceToLength = function(input, length) {
	var result = input;
	for (var i = input.length; i <= length; i++) {
		result += ' ';
	}
	return result;
};

uix.round = function(num, points) {
	return Math.round(num * Math.pow(10, points)) / Math.pow(10, points);
};

uix.tStamp = function(label, level, startTime) {
	if (uix.pfLog && startTime !== null) {
		uix.log(label + ': ' + uix.round(uix.time() - startTime, 5) + ' ms');
	}
};

uix.time = function(force) {
	if (force || uix.pfLog) {
		if (!uix.isSet(window.performance)) {
			return Date.now();
		}
		return window.performance.now ? (performance.now() + performance.timing.navigationStart) : Date.now();
	}
	return null;
};

// #######################################################################################
// #																					 #
// #									Grid Layout										 #
// #																					 #
// #######################################################################################

audentio.grid = {
	running: false,
	listenersAdded: false,
	minEnableWidth: 1,
	layout: {},
	eles: [],
	equalCategories: true,
	classAdded: false,
	alwaysCheck: true,
	nextSubnodeIds: [],
	scriptTags: [],
	layoutNodeIds: [],
	debug: '',
	globalWidth: 1,

	parse: function(layoutOrig) {
		audentio.grid.debug = layoutOrig;

		var ag = audentio.grid,
			result = {
				global: {
					root: {
						numCol: 6,
						fillLast: 0,
						minWidth: 300
					}
				}
			},
			layout = JSON.parse(layoutOrig.split('&quot;').join('"')),
			layoutKeys = Object.keys(layout),
			i = 0,
			len = 0;

		for (i = 0, len = ag.scriptTags.length; i < len; i++) {
			audentio.grid.nextSubnodeIds.push(ag.getNodeId(ag.scriptTags[i].nextElementSibling));
		}

		for (var keyNum = 0, keyLen = layoutKeys.length; keyNum < keyLen; keyNum++) {
			var key = layoutKeys[keyNum],
				tempKey = (layoutKeys[keyNum] == 'category') ? 0 : layoutKeys[keyNum],
				nextSubnodeId = 0,
				subNodeIndex = 0,
				keyName,
				keyEle,
				colEles,
				colKeys,
				colNum,
				colLen,
				col,
				valEles,
				valKeys,
				valNum,
				valLen,
				val,
				colWidth;

			for (i = 0, len = ag.layoutNodeIds.length; i < len; i++) {
				if (ag.layoutNodeIds[i] == tempKey) {
					nextSubnodeId = ag.nextSubnodeIds[i];
					subNodeIndex = i;
					break;
				}
			}

			if (nextSubnodeId === 0) { // root node
				keyName = 'node_' + tempKey;
				keyEle = layout[key];
				if (key == 'default') {
					keyName = 'global';
				}

				if (typeof(result[keyName]) === 'undefined') {
					result[keyName] = {};
				}
				if (typeof(result[keyName].root) === 'undefined') {
					result[keyName].root = {};
				}
				if (keyEle.fill_last_row !== undefined && parseInt(keyEle.fill_last_row.value) >= 0) {
					result[keyName].root.fillLast = parseInt(keyEle.fill_last_row.value);
				}
				if (keyEle.minimum_column_width !== undefined && parseInt(keyEle.minimum_column_width.value) >= 0) {
					result[keyName].root.minWidth = parseInt(keyEle.minimum_column_width.value);
				}
				if (keyEle.maximum_columns !== undefined && parseInt(keyEle.maximum_columns.value) >= 0) {
					result[keyName].root.numCol = parseInt(keyEle.maximum_columns.value);
				}
				if (keyEle.column_widths !== undefined && keyEle.column_widths.value == 1) {
					if (keyEle.custom_column_widths !== undefined && keyEle.custom_column_widths.layouts !== undefined) {
						colEles = keyEle.custom_column_widths.layouts;
						colKeys = Object.keys(colEles);

						for (colNum = 0, colLen = colKeys.length; colNum < colLen; colNum++) {
							col = colKeys[colNum];
							valEles = colEles[col];
							valKeys = Object.keys(valEles);

							result[keyName].root['col_' + col] = {};

							for (valNum = 0, valLen = valKeys.length; valNum < valLen; valNum++) {
								val = valKeys[valNum];
								colWidth = parseInt(valEles[val]);
								if (colWidth < 1 || colWidth !== colWidth) {
									colWidth = 1;
								}
								result[keyName].root['col_' + col]['col' + val] = colWidth;
							}
						}
					}
				}
				if (!uix.isSet(result[keyName].listeners)) {
					result[keyName].listeners = [];
				}
			} else { // subNode
				var parentNodeId = ag.getNodeId(ag.scriptTags[subNodeIndex].parentElement.parentElement);
				if (parentNodeId == -1) {
					parentNodeId = 0;
				}

				var subKeyName = 'node_' + nextSubnodeId;
				keyName = 'node_' + parentNodeId;
				keyEle = layout[key];

				if (typeof(result[keyName]) === 'undefined') {
					result[keyName] = {};
				}
				if (typeof(result[keyName].root) === 'undefined') {
					result[keyName].root = {
						fillLast: parseInt(layout.default.fill_last_row.value),
						minWidth: parseInt(layout.default.minimum_column_width.value),
						numCol: parseInt(layout.default.maximum_columns.value)
					};
				}
				if (typeof(result[keyName][subKeyName]) === 'undefined') {
					result[keyName][subKeyName] = {};
					if (typeof(result[keyName].subLayout) === 'undefined') {
						result[keyName].subLayout = {};
					}
					result[keyName].subLayout[subKeyName] = subKeyName;
					if (keyEle.fill_last_row !== undefined && parseInt(keyEle.fill_last_row.value) >= 0) {
						result[keyName][subKeyName].fillLast = parseInt(keyEle.fill_last_row.value);
					}
					if (keyEle.minimum_column_width !== undefined && parseInt(keyEle.minimum_column_width.value) >= 0) {
						result[keyName][subKeyName].minWidth = parseInt(keyEle.minimum_column_width.value);
					}
					if (keyEle.maximum_columns !== undefined && parseInt(keyEle.maximum_columns.value) >= 0) {
						result[keyName][subKeyName].numCol = parseInt(keyEle.maximum_columns.value);
					}
					if (keyEle.column_widths !== undefined && keyEle.column_widths.value == 1) {
						if (keyEle.custom_column_widths !== undefined && keyEle.custom_column_widths.layouts !== undefined) {
							colEles = keyEle.custom_column_widths.layouts;
							colKeys = Object.keys(colEles);

							for (colNum = 0, colLen = colKeys.length; colNum < colLen; colNum++) {
								col = colKeys[colNum];
								valEles = colEles[col];
								valKeys = Object.keys(valEles);

								result[keyName][subKeyName]['col_' + col] = {};

								for (valNum = 0, valLen = valKeys.length; valNum < valLen; valNum++) {
									val = valKeys[valNum];
									colWidth = parseInt(valKeys[val]);
									if (colWidth < 1 || colWidth !== colWidth) {
										colWidth = 1;
									}
									result[keyName][subKeyName]['col_' + col]['col' + val] = colWidth;
								}
							}
						}
					}
				}
			}
		}

		audentio.grid.layout = result;

		if (ag.running) {
			ag.update();
		}
		return result;
	},

	addSizeListener: function(node, className, widthMax, widthMin) {
		var ag = audentio.grid;

		if (!uix.isSet(ag.layout[node])) {
			audentio.grid.layout[node] = {};
		}
		if (!uix.isSet(ag.layout[node].listeners)) {
			audentio.grid.layout[node].listeners = [];
		}
		audentio.grid.layout[node].listeners.push([className, widthMax, widthMin]);

		if (ag.running) {
			ag.update();
		}
	},

	addSubNode: function(layoutNodeId) {
		var scriptNum = document.scripts.length - 1,
			scriptTag = document.scripts[scriptNum];
		while (scriptTag.src !== '' && scriptNum > 0) {
			scriptNum = scriptNum - 1;
			scriptTag = document.scripts[scriptNum];
		}
		audentio.grid.scriptTags.push(scriptTag);
		audentio.grid.layoutNodeIds.push(layoutNodeId);
	},

	init: function(layout, minWidth) {
		var ag = audentio.grid,
			pfTime = uix.time();

		ag.initGet(layout, minWidth);
		ag.initSet(layout, minWidth);

		uix.tStamp('Grid Init', 2, pfTime);
	},

	initGet: function(layout, minWidth) {
		var ag = audentio.grid,
			pfTime = uix.time(),
			forums;

		if (layout !== undefined) {
			audentio.grid.layout = layout;
		}
		if (minWidth !== undefined) {
			audentio.grid.minEnableWidth = minWidth;
		}
		if (ag.running === false && window.innerWidth >= ag.minEnableWidth) {
			forums = ag.getForums();
			if (forums !== null) {
				var nodeId = 0,
					bodyClass = document.getElementsByTagName('body')[0].className.split(' ');

				for (var i = 0, len = bodyClass.length; i < len; i++) {
					if (bodyClass[i].indexOf('node') > -1) {
						var possibleId = bodyClass[i].replace('node', '');
						if (possibleId == parseInt(possibleId)) {
							nodeId = possibleId;
							break;
						}
					}
				}

				ag.checkWidths(); // parse and set column widths
				ag.recurse(forums, 'node_' + nodeId); // build ele tree
				ag.updateGet(); // update element widths
			}
		} else {
			forums = ag.getForums();
		}

		uix.tStamp('Grid Init Get', 2, pfTime);
	},

	initSet: function() {
		var ag = audentio.grid,
			pfTime = uix.time(),
			forums;

		if (ag.running === false && window.innerWidth >= ag.minEnableWidth) {
			audentio.grid.running = true;
			forums = ag.getForums();
			if (forums !== null) {
				if (ag.classAdded === false) {
					forums.className += ' audentio_grid_running';
					audentio.grid.classAdded = true;
				}

				ag.updateSet(); // update element widths
			}
		} else {
			forums = ag.getForums();
		}

		if (forums !== null) {
			forums.style.visibility = 'visible';
		}

		if (ag.listenersAdded === false) {
			audentio.grid.listenersAdded = true;
		}

		uix.tStamp('Grid Init Set', 2, pfTime);
	},

	checkWidths: function() {
		var ag = audentio.grid,
			node0Set = false,
			nodeKeys = Object.keys(ag.layout);

		for (var i = 0, lenNode = nodeKeys.length; i < lenNode; i++) {
			var node = nodeKeys[i],
				nodeEle = ag.layout[node],
				subKeys = Object.keys(nodeEle);

			for (var j = 0, lenSub = subKeys.length; j < lenSub; j++) {
				var subLayout = subKeys[j],
					subEle = nodeEle[subLayout],
					colKeys = Object.keys(subEle);

				if (node == 'node_0') {
					node0Set = true;
					if (ag.layout[node][subLayout].numCol != 1) {
						audentio.grid.equalCategories = false; // performance improvement, don't need to check all widths
					}
				}
				for (var k = 0, lenCol = colKeys.length; k < lenCol; k++) {

					var col = colKeys[k],
						colEle = subEle[col],
						widthKeys = uix.fn.getKeys(colEle),
						totalWidth = 0;

					if (col.indexOf('col_') > -1 && widthKeys !== null) {
						var l,
							len;
						for (l = 0, len = widthKeys.length; l < len; l++) {
							totalWidth += parseInt(colEle[widthKeys[l]]);
						}
						if (totalWidth != 100) {
							for (l = 0, len = widthKeys.length; l < len; l++) {
								var width = widthKeys[l];
								audentio.grid.layout[node][subLayout][col][width] = ((parseInt(colEle[width]) / totalWidth) * 100);
							}
						}
					}
				}
			}
		}
		if (node0Set === false && ag.layout.global.root.numCol != 1) {
			audentio.grid.equalCategories = false;
		}
	},

	getNodeId: function(ele) {
		var ret = -1;
		if (uix.isSet(ele)) {
			var classList = ele.className.split(' ');
			for (var i = 0, len = classList.length; i < len; i++) {
				if (classList[i].indexOf('node_') > -1 && classList[i].indexOf('audentio') == -1) {
					ret = parseInt(classList[i].replace('node_', ''));
				}
			}
		}
		return ret;
	},

	recurse: function(ele, layoutName) {
		var ag = audentio.grid;
		if (ag.layout[layoutName] === undefined) {
			layoutName = 'global';
		}
		var newEle = {
				ele: ele,
				layoutName: layoutName,
				children: [],
				ratio: 1,
				eleID: ag.getNodeId(ele.parentNode),
				subLayouts: [{
					name: 'root',
					count: 0,
					currentCols: 0
				}]
			},
			children = ele.children,
			subLayoutName = 'root',
			hasSubLayouts = false,
			numChildren = 0,
			i,
			len,
			child;

		for (i = 0, len = children.length; i < len; i++) {
			var currentChild = children[i];
			if (currentChild.tagName == 'LI') {
				child = {
					ele: currentChild,
					nodeId: ag.getNodeId(currentChild),
					eleIndex: -1,
					setup: false,
					lastWidth: 100,
					classes: ''
				};
				var subEles = ag.layout[layoutName],
					subKeys = Object.keys(subEles);

				for (var subNum = 0, subLen = subKeys.length; subNum < subLen; subNum++) {
					var subLayout = subKeys[subNum];

					if ('node_' + child.nodeId == subLayout) {
						subLayoutName = subLayout;
						newEle.subLayouts.push({
							name: subLayout,
							count: 0,
							currentCols: 0
						});
						hasSubLayouts = true;
					}
				}
				newEle.subLayouts[newEle.subLayouts.length - 1].count++;

				child.subLayout = subLayoutName;
				newEle.children.push(child);
				numChildren++;
			}
		}

		if (ag.layout.global.root.numCol >= 1 || ag.layout[layoutName].root.numCol >= 1 || hasSubLayouts) {
			ag.eles.push(newEle);
		}

		for (i = 0; i < numChildren; i++) {
			var nodeId = newEle.children[i].nodeId;
			var nextLayoutName = 'global';
			if (ag.layout['node_' + nodeId] !== undefined) {
				nextLayoutName = 'node_' + nodeId;
			}

			child = newEle.children[i].ele.getElementsByClassName('nodeList');
			if (child.length > 0) {
				ag.recurse(child[0], nextLayoutName);
			}
		}
	},

	set: function(index, makeChanges) {
		if (makeChanges !== false) {
			makeChanges = true;
		}
		var ag = audentio.grid,
			eleRoot = ag.eles[index],
			ele = eleRoot.ele,
			layoutName = eleRoot.layoutName,
			changeMade = false,
			nodeChildren = eleRoot.children,
			childStart = 0,
			absoluteRowNum = 0,
			absoluteNodeNum = 0,
			subLayoutNum = 0,
			numSubLayouts = eleRoot.subLayouts.length,
			subKeys = Object.keys(eleRoot.subLayouts);

		for (var subNum = 0, lenSub = subKeys.length; subNum < lenSub; subNum++) {
			var subLayout = subKeys[subNum];

			subLayoutNum++;
			var fillLast = ag.layout.global.root.fillLast,
				subName = eleRoot.subLayouts[subLayout].name,
				subLayoutVar = {},
				children = [],
				widthSum = 100,
				rowNum = 0,
				i,
				len;

			if (uix.isSet(ag.layout[layoutName]) && uix.isSet(ag.layout[layoutName][subName])) {
				subLayoutVar = ag.layout[layoutName][subName];
			}
			if (typeof(subLayoutVar.fillLast) === 'number') {
				fillLast = subLayoutVar.fillLast; // override global
			}

			for (i = 0, len = nodeChildren.length; i < len; i++) {
				if (subName == nodeChildren[i].subLayout) {
					children.push(nodeChildren[i]);
				}
			}
			var childLen = children.length,
				numCols = ag.findCols(index, childLen, subName);

			if (subLayoutVar.currentCols != numCols || ag.alwaysCheck) {
				changeMade = true;
				var lastFullRow = childLen - (childLen % numCols),
					itemWidth;

				for (i = 0; i < childLen; i++) {
					itemWidth = 100 / numCols;
					var lastRowCols = 0;
					if (uix.isSet(ag.layout.global.root['col_' + numCols])) {
						itemWidth = ag.layout.global.root['col_' + numCols]['col' + (i % numCols + 1)];
					}
					if (uix.isSet(subLayoutVar['col_' + numCols])) {
						itemWidth = subLayoutVar['col_' + numCols]['col' + (i % numCols + 1)];
					}

					if (fillLast === 0) {
						lastRowCols = (childLen % numCols);
						if (i >= lastFullRow) {
							itemWidth = 100 / lastRowCols;
						}
					} else if (fillLast == 2) {
						if (i >= lastFullRow) {
							lastRowCols = ag.findCols(index, (childLen % numCols), subName);
							itemWidth = 100 / lastRowCols;
							if (uix.isSet(ag.layout.global.root['col_' + lastRowCols])) {
								itemWidth = ag.layout.global.root['col_' + lastRowCols]['col' + ((i - lastFullRow) % lastRowCols + 1)];
							}
							if (uix.isSet(subLayoutVar['col_' + lastRowCols])) {
								itemWidth = subLayoutVar['col_' + lastRowCols]['col' + ((i - lastFullRow) % lastRowCols + 1)];
							}
						}
					} else if (fillLast == 3) {
						lastRowCols = 1;
						if (i >= lastFullRow) {
							itemWidth = 100;
						}
					}

					var leftCol = (widthSum >= 99 || itemWidth == 100) ? true : false,
						rightCol = (i % numCols == numCols - 1 || itemWidth == 100 || (i >= lastFullRow && (i - lastFullRow) % lastRowCols == lastRowCols - 1)) ? true : false,
						maxCols = (lastRowCols > 0) ? lastRowCols : numCols;

					if (widthSum >= 99) {
						widthSum = 0;
						rowNum++;
						absoluteRowNum++;
					}

					var eleChildren = eleRoot.children;
					if (eleRoot.layoutName == 'node_0') {
						for (var j = 1, len2 = eleChildren.length; j <= len2; j++) {
							if (children[i].nodeId == eleChildren[j - 1].nodeId && uix.isSet(ag.eles[j])) {
								ag.eles[j].ratio = itemWidth / 100;
							}
						}
					}

					if (makeChanges) {
						ag.setClass(children[i], i % numCols + 1, maxCols, (eleRoot.parentWidth * itemWidth) / 100, rowNum, absoluteRowNum, i + 1, absoluteNodeNum + 1, subLayoutNum, leftCol, rightCol, numSubLayouts, ag.layout[layoutName].listeners);

						if (itemWidth !== children[i].lastWidth) {
							children[i].ele.style.width = itemWidth + '%';
							children[i].lastWidth = itemWidth;
						}

						if (children[i].setup === false) {
							children[i].setup = true;
						}
					}

					widthSum += itemWidth;
					absoluteNodeNum++;
				}
				audentio.grid.eles[index].subLayouts[subLayout].currentCols = numCols;
			}

			childStart++;
		}
		return changeMade;
	},

	setClass: function(child, colNum, maxCol, width, rowNum, rowNumAbs, nodeNum, nodeAbsNum, subLayoutNum, leftCol, rightCol, numSubLayouts, listeners) {
		var ag = audentio.grid,
			prefix = 'audentio_grid';

		if (!uix.isSet(listeners) || listeners.length === 0) {
			listeners = ag.layout.global.listeners;
		}

		var newClasses = ' ' + prefix + ' ';
		if (width != 100) {
			newClasses += prefix + '_active ';
		}
		if (leftCol) {
			newClasses += prefix + '_left ';
		}
		if (rightCol) {
			newClasses += prefix + '_right ';
		}
		newClasses += prefix + '_column_' + colNum + ' ';
		newClasses += prefix + '_columnMax_' + maxCol + ' ';
		newClasses += prefix + '_rowSublayout_' + rowNum + ' ';
		newClasses += prefix + '_row_' + rowNumAbs + ' ';
		newClasses += prefix + '_subLayout_' + subLayoutNum + ' ';
		newClasses += prefix + '_numSubLayouts_' + numSubLayouts + ' ';
		newClasses += prefix + '_nodeSublayout_' + nodeNum + ' ';
		newClasses += prefix + '_node_' + nodeAbsNum + ' ';
		newClasses += (rowNumAbs % 2 === 1) ? prefix + '_row_odd ' : prefix + '_row_even ';

		listenerLen = listeners.length;

		if (listenerLen > 0) {
			for (var i = 0; i < listenerLen; i++) {
				if (width < listeners[i][1] && width >= listeners[i][2]) {
					newClasses += listeners[i][0] + ' ';
				}
			}
		}

		if (child.classes != newClasses) {
			child.ele.className = child.ele.className.replace(child.classes, '') + newClasses;
			child.classes = newClasses;
		}
	},

	findCols: function(index, numChildren, subName) {
		var ag = audentio.grid,
			subLayout = {},
			ele = ag.eles[index].ele,
			layoutName = ag.eles[index].layoutName,
			minWidth = ag.layout.global.root.minWidth,
			numColumns = 1,
			parentWidth = ag.eles[index].parentWidth;

		if (uix.isSet(ag.layout[layoutName]) && uix.isSet(ag.layout[layoutName][subName])) {
			subLayout = ag.layout[layoutName][subName];
		}
		if (typeof(subLayout.minWidth) === 'number') {
			minWidth = subLayout.minWidth; // override global
		}
		var minPercent = (minWidth / parentWidth) * 100;

		if (typeof(subLayout.numCol) === 'number') {
			numColumns = subLayout.numCol;
		}
		if (numColumns > numChildren && subLayout.fillLast != 1) {
			numColumns = numChildren;
		}
		var numCols = numColumns;

		for (var i = numColumns; i > 1; i--) {
			var minCol = 100;
			for (j = 1; j <= subLayout.numCol; j++) {
				var width = 100 / i;
				if (uix.isSet(ag.layout.global.root['col_' + i])) {
					width = ag.layout.global.root['col_' + i]['col' + j];
				}
				if (uix.isSet(subLayout['col_' + i])) {
					width = subLayout['col_' + i]['col' + j];
				}
				if (width !== undefined && width < minCol) {
					minCol = width;
				}
			}

			if (minCol >= minPercent) {
				break;
			} else {
				numCols = i - 1;
			}
		}

		return numCols;
	},

	update: function() {
		var ag = audentio.grid,
			pfTime = uix.time();

		ag.updateGet();
		ag.updateSet();

		uix.tStamp('Grid Update', 2, pfTime);
	},

	updateGet: function() {
		var ag = audentio.grid,
			pfTime = uix.time();
		if (window.innerWidth >= ag.minEnableWidth) {

			var gridEles = ag.eles,
				gridElesLen = gridEles.length;
			if (gridElesLen > 0) {
				var globalWidth = gridEles[0].ele.offsetWidth / gridEles[0].ratio;
				audentio.grid.globalWidth = gridEles[0].ele.offsetWidth / gridEles[0].ratio;
				for (i = 0; i < gridElesLen; i++) {
					gridEles[i].parentWidth = globalWidth * gridEles[i].ratio;
					ag.set(i, false); // fixes a possible error with parentwidths not accounting for ratios
				}
			}
		}

		uix.tStamp('Grid Update Get', 2, pfTime);
	},

	updateSet: function() {
		var ag = audentio.grid,
			pfTime = uix.time();
		if (window.innerWidth >= ag.minEnableWidth) {
			if (ag.running) {
				var gridEles = ag.eles,
					gridElesLen = gridEles.length;
				if (gridElesLen > 0) {
					for (i = 0; i < gridElesLen; i++) {
						ag.set(i);
					}
				}
			} else {
				ag.init();
			}
		} else {
			audentio.grid.running = false;
			var forums = ag.getForums();
			if (ag.classAdded && forums !== null) {
				forums.className = forums.className.remove('audentio_grid_running');
				audentio.grid.classAdded = false;
			}
		}

		uix.tStamp('Grid Update Set', 2, pfTime);
	},

	getForums: function() {
		var ag = audentio.grid;

		var d = document,
			html = d.getElementsByTagName('html');

		if (html.length == 1 && html[0].className.indexOf('uix_nodeGridDisabled') > -1) {
			return null;
		} else {
			var forums = d.getElementById('forums');
			if (forums === null) {
				forumsTemp = d.getElementsByClassName('nodeList');
				if (forumsTemp.length == 1) {
					forums = forumsTemp[0];
				}
			}
			if (forums === null) {
				forumsTemp = d.getElementsByClassName('watch_forums');
				if (forumsTemp.length == 1) {
					forumsTemp = forumsTemp[0].getElementsByClassName('nodeList');
				}
				if (forumsTemp.length == 1) {
					forums = forumsTemp[0];
				}
			}
			return forums;
		}
	}
};

// #######################################################################################
// #																					 #
// #								Sliding Message Info								 #
// #																					 #
// #######################################################################################

uix.messageInfo = {
	needsInit: true,
	hoverTimer: null,
	hoverDelay: 200,
	recentChangeDelay: 500,

	init: function() {
		var um = uix.messageInfo,
			messages = $('.messageList .message .messageUserBlock--hasCollapsibleElements');

		for (var i = 0, len = messages.length; i < len; i++) {
			var extraInfo = false,
				avatarHolder = false;
			if (uix.threadSlidingExtra) {
				if ($('.avatarHolder', messages[i]).length === 0) {
					avatarHolder = true;
				}
			}

			if (uix.threadSlidingExtra) {
				if ($('.extraUserInfo', messages[i]).length === 0) {
					extraInfo = true;
				}
			}
			if (extraInfo || avatarHolder) {
				//$(messages[i]).removeClass('messageUserBlock--hasCollapsibleElements');
			}
		}

		var threadSlideToggle = $('.js-messageUserBlockToggle');

		if (uix.threadSlidingHover && !XenForo.isTouchBrowser()) {
			var messageUserBlock = $('.messageUserBlock');

			threadSlideToggle.unbind('mousemove');
			threadSlideToggle.unbind('mouseenter');
			threadSlideToggle.unbind('mouseleave');
			messageUserBlock.unbind('mouseleave');

			threadSlideToggle.mousemove(function(e) {
				window.clearTimeout(um.hoverTimer);
				uix.messageInfo.hoverTimer = window.setTimeout(function() {
					um.expand(e.target);
				}, um.hoverDelay);
			});

			threadSlideToggle.mouseenter(function(e) {
				window.clearTimeout(um.hoverTimer);
				uix.messageInfo.hoverTimer = window.setTimeout(function() {
					$(e.target).closest('.messageUserBlock').addClass('mouseOver');
					um.expand(e.target);
				}, um.hoverDelay);
			});

			threadSlideToggle.mouseleave(function(e) {
				window.clearTimeout(um.hoverTimer);
			});

			messageUserBlock.mouseleave(function(e) {
				var targetEle = $(e.target);
				if (!targetEle.hasClass('Tooltip')) {
					targetEle.closest('.messageUserBlock').removeClass('mouseOver');
					um.collapse(e.target);
				}
			});
		}

		threadSlideToggle.unbind('click');

		threadSlideToggle.click(function(e) {
			var parent = $(e.target).closest('.messageUserBlock');

			if (uix.isSet(parent) && uix.responsiveMessageBreakpoint < uix.windowWidth) {
				if (parent.hasClass('has-expandedElements')) {
					um.collapse(e.target, true);
				} else {
					um.expand(e.target, true);
				}
			}
		});

		uix.messageInfo.needsInit = false;
	},

	collapse: function(ele, clicked) {
		var parent = $(ele).closest('.messageUserBlock.messageUserBlock--hasCollapsibleElements'),
			collapseBlocked = false;

		if ($(parent).closest('.message').hasClass('quickReply')) {
			collapseBlocked = true;
		}

		if (uix.isSet(parent) && uix.responsiveMessageBreakpoint < uix.windowWidth && parent.hasClass('has-expandedElements') && !collapseBlocked && (!parent.hasClass('recentChange') || clicked === true)) {
			if ((clicked === true) || (!uix.isSet(clicked) && !parent.hasClass('clickedOpen'))) {
				if (uix.threadSlidingAvatar) {
					$('.avatarHolder', parent).slideUp();
					window.setTimeout(function() {
						$('.avatarHolder', parent).removeClass('is-expanded').addClass('is-collapsed');
					}, 400);
				}
				if (uix.threadSlidingExtra) {
					$('.extraUserInfo', parent).slideUp();
					window.setTimeout(function() {
						$('.extraUserInfo', parent).removeClass('is-expanded').addClass('is-collapsed');
					}, 400);
				}

				parent.removeClass('has-expandedElements');
				window.setTimeout(function() {
					parent.removeClass('is-expanded').addClass('is-collapsed');
				}, 400);
				if (clicked === true) {
					parent.removeClass('clickedOpen');
				}

				parent.addClass('recentChange');
				window.setTimeout(function() {
					parent.removeClass('recentChange');
				}, uix.messageInfo.recentChangeDelay);
			}
		} else {
			window.setTimeout(function() {
				if (!parent.hasClass('mouseOver')) {
					//uix.messageInfo.collapse(ele, clicked);
				}
			}, uix.messageInfo.recentChangeDelay);
		}
	},

	expand: function(ele, clicked) {
		if (uix.isSet(ele)) {
			var parent = $(ele).closest('.messageUserBlock.messageUserBlock--hasCollapsibleElements'),
				collapseBlocked = false;

			if ($(parent).closest('.message').hasClass('quickReply')) {
				collapseBlocked = true;
			}

			if (uix.isSet(parent) && uix.responsiveMessageBreakpoint < uix.windowWidth && !parent.hasClass('has-expandedElements') && !collapseBlocked && (!parent.hasClass('recentChange') || clicked === true)) {
				if (uix.threadSlidingAvatar) {
					$('.avatarHolder', parent).addClass('is-expanded').removeClass('is-collapsed').slideDown();
				}
				if (uix.threadSlidingExtra) {
					$('.extraUserInfo', parent).addClass('is-expanded').removeClass('is-collapsed').slideDown();
				}

				parent.addClass('has-expandedElements');
				parent.addClass('is-expanded').removeClass('is-collapsed');
				if (clicked === true) {
					parent.addClass('clickedOpen');
				}

				parent.addClass('recentChange');
				window.setTimeout(function() {
					parent.removeClass('recentChange');
				}, uix.messageInfo.recentChangeDelay);
			} else {
				window.setTimeout(function() {
					if (parent.hasClass('mouseOver')) {
						//uix.messageInfo.expand(ele, clicked);
					}
				}, uix.messageInfo.recentChangeDelay);
			}
		}
	}
};

// #######################################################################################
// #																					 #
// #									Sliding Signature								 #
// #																					 #
// #######################################################################################

uix.messageSignature = {
	needsInit: true,
	eles: [],
	heights: [],
	minHeight: uix.signatureMaxHeight,
	hoverTimer: null,
	hoverDelay: 200,
	recentChangeDelay: 500,

	init: function() {
		var um = uix.messageSignature;
		um.initGet();
		um.initSet();
	},

	initGet: function() {
		var um = uix.messageSignature;

		uix.messageSignature.eles = $('.messageList .message:not(.uix_noCollapseMessage) .uix_signature');

		if (um.eles.length) {
			if (uix.signatureHoverEnabled && !XenForo.isTouchBrowser()) {
				var signatureToggleHover = $('.uix_signatureToggleHover'),
					liMessage = $('li.message');
				signatureToggleHover.unbind('mousemove');
				signatureToggleHover.unbind('mouseenter');
				signatureToggleHover.unbind('mouseleave');
				liMessage.unbind('mouseleave');

				signatureToggleHover.mousemove(function(e) {
					window.clearTimeout(um.hoverTimer);
					uix.messageSignature.hoverTimer = window.setTimeout(function() {
						var parent = um.getParent(e.target);

						if (uix.isSet(parent)) {
							um.expand(parent);
						}
					}, um.hoverDelay);
				});

				signatureToggleHover.mouseenter(function(e) {
					window.clearTimeout(um.hoverTimer);
					uix.messageSignature.hoverTimer = window.setTimeout(function() {
						var parent = um.getParent(e.target);

						if (uix.isSet(parent)) {
							parent.addClass('mouseOver');
							um.expand(parent);
						}
					}, um.hoverDelay);
				});

				signatureToggleHover.mouseleave(function(e) {
					window.clearTimeout(um.hoverTimer);
				});

				liMessage.mouseleave(function(e) {
					var parent = um.getParent(e.target);
					if (uix.isSet(parent)) {
						parent.removeClass('mouseOver');
						if (!parent.hasClass('clickedOpen')) {
							um.collapse(parent);
						}
					}
				});
			}

			var signatureToggle = $('.uix_signatureToggle');
			signatureToggle.unbind('click');

			signatureToggle.click(function(e) {
				var parent = um.getParent(e.target);

				if (uix.isSet(parent)) {
					um.toggle(parent);
				}
			});
		}
	},

	initSet: function() {
		uix.messageSignature.checkSet(false);
		if (uix.messageSignature.eles.length) {
			uix.messageSignature.needsInit = false;
		}
	},

	checkGet: function() {
		var um = uix.messageSignature;

		for (var i = 0, len = um.eles.length; i < len; i++) {
			uix.messageSignature.heights.push(um.eles[i].offsetHeight);
		}
	},

	checkSet: function(tryRemove) {
		if (!uix.isSet(tryRemove)) {
			tryRemove = true;
		}
		var um = uix.messageSignature;
		for (var i = 0, len = um.eles.length; i < len; i++) {
			if (um.heights[i] > (um.minHeight + 20)) {
				$(um.eles[i]).closest('.signature').addClass('uix_signatureCut uix_show');
			} else if (tryRemove) {
				$(um.eles[i]).closest('.signature').removeClass('uix_signatureCut uix_show');
			}
		}
	},

	check: function() {
		uix.messageSignature.checkGet();
		uix.messageSignature.checkSet();
	},

	getParent: function(target) {
		var targetEle = $(target),
			parent = targetEle.closest('.signature');

		if (uix.isSet(parent) && parent.length) {
			return parent;
		} else {
			parent = targetEle.closest('li.message').find('.signature');
			if (uix.isSet(parent) && parent.length) {
				return parent;
			} else {
				return null;
			}
		}
	},

	toggle: function(parent) {
		if (parent.hasClass('uix_signatureExpanded')) {
			parent.removeClass('clickedOpen');
			uix.messageSignature.collapse(parent);
		} else {
			parent.addClass('clickedOpen');
			uix.messageSignature.expand(parent);
		}
	},

	expand: function(parent) {
		parent.addClass('uix_signatureExpanded');
		var height = parent.find('.uix_signature').get(0).offsetHeight;
		parent.find('.uix_signatureWrapperInner').css('max-height', height + 'px');

		window.setTimeout(function() {
			parent.removeClass('uix_show');
			//parent.closest('li.message').addClass('uix_signatureExpanded');
		}, 300);
	},

	collapse: function(parent) {
		parent.addClass('uix_show');
		//parent.closest('li.message').removeClass('uix_signatureExpanded');
		window.requestAnimationFrame(function() {
			parent.removeClass('uix_signatureExpanded');
			parent.find('.uix_signatureWrapperInner').css('max-height', uix.messageSignature.minHeight + 'px');
		});
	}
};

uix.offcanvas = {
	wrapper: '',
	exit: '',
	sidePanes: '',
	selectedHeight: 0,
	showingLeft: false,
	showingRight: false,
	triggerLeft: false,
	triggerRight: false,
	tabs: [],

	/*
	{
		trigger:
		target:
		init:
		view:
		group:
		needsInit: true;
		valid;
	}
	*/
	registerTab: function(config) {
		config.needsInit = true;
		config.valid = false;
		if (config.trigger.length && config.target.length) {
			config.valid = true;
		}

		var newGroup = true;
		for (var i = 0, len = uix.offcanvas.tabs.length; i < len; i++) {
			if (uix.offcanvas.tabs[i].group == config.group) {
				newGroup = false;
				break;
			}
		}
		if (newGroup) {
			config.needsInit = false;
			if (typeof(config.init == 'function')) {
				config.init();
			}
		}

		uix.offcanvas.tabs.push(config);
	},

	displayTab: function(index) {
		var currentTab = uix.offcanvas.tabs[index];
		for (var i = 0, len = uix.offcanvas.tabs.length; i < len; i++) {
			var tab = uix.offcanvas.tabs[i];
			if (tab.valid && tab.group == currentTab.group) {
				if (i < index) {
					tab.trigger.removeClass('is-active');
					if (tab.visible) {
						tab.visible = false;
						tab.target.removeClass('is-active').removeClass('is-right').addClass('is-left').removeClass('is-hidden');
					} else {
						tab.target.addClass('is-hidden');
						(function(tab) {
							window.requestAnimationFrame(function() {
								tab.target.removeClass('is-active').removeClass('is-right').addClass('is-left');
								window.setTimeout(function() {
									tab.target.removeClass('is-hidden');
								}, 500);
							});
						})(tab);
					}
				} else if (i == index) {
					tab.target.addClass('is-active').removeClass('is-right').removeClass('is-left').removeClass('is-hidden');
					tab.trigger.addClass('is-active');
					uix.offcanvas.tabs[i].visible = true;
				} else if (i > index) {
					tab.trigger.removeClass('is-active');
					if (tab.visible) {
						tab.visible = false;
						tab.target.removeClass('is-active').addClass('is-right').removeClass('is-left').removeClass('is-hidden');
					} else {
						tab.target.addClass('is-hidden');
						(function(tab) {
							window.requestAnimationFrame(function() {
								tab.target.removeClass('is-active').addClass('is-right').removeClass('is-left');
								window.setTimeout(function() {
									tab.target.removeClass('is-hidden');
								}, 500);
							});
						})(tab);
					}
				}
			}
		}
	},

	initTab: function() {
		for (var i = 0, len = uix.offcanvas.tabs.length; i < len; i++) {
			(function(i) {
				if (uix.offcanvas.tabs[i].valid) {
					uix.offcanvas.tabs[i].trigger.on('click', function() {
						var tab = uix.offcanvas.tabs[i];
						if (tab.needsInit) {
							uix.offcanvas.tabs[i].needsInit = false;
							if (typeof(tab.init == 'function')) {
								tab.init();
							}
						}
						uix.offcanvas.displayTab(i);
						uix.offcanvas.tabs[i].visible = true;
						if (typeof(tab.view == 'function')) {
							tab.view();
						}
						return false;
					});
				}
			})(i);
		}
	},

	init: function() {
		var pfTime = uix.time();
		uix.offcanvas.initGet();
		uix.offcanvas.initSet();
		uix.tStamp('UIX.init.offCanvas', 1, pfTime);
	},

	initGet: function() {
		var pfTime = uix.time();
		uix.offcanvas.wrapper = $('.js-uix_panels');
		uix.offcanvas.exit = $('.js-panelMask');
		uix.offcanvas.sidePanes = uix.offcanvas.wrapper.find('.js-sidePanelWrapper');

		uix.offcanvas.selectedHeight = uix.offcanvas.getMaxHeight($('.sidePanel__navTabs .navTab.selected'));

		$('.sidePanel__navTabs .SplitCtrl').on('click', function(e) {
			var closestNavTab = $(e.target).closest('.navTab');
			if (closestNavTab.hasClass('is-active')) {
				uix.offcanvas.setIcon($('.sidePanel__navTabs .navTab .js-offcanvasIcon.uix_icon-collapseDropdown'), 1);
				$('.sidePanel__navTabs .navTab').removeClass('is-active');
				$('.sidePanel__navTabs .tabLinks').css('maxHeight', '');
				uix.offcanvas.setIcon(closestNavTab.find('.js-offcanvasIcon'), 1);
			} else {
				uix.offcanvas.setIcon($('.sidePanel__navTabs .navTab .js-offcanvasIcon.uix_icon-collapseDropdown'), 1);
				$('.sidePanel__navTabs .navTab').removeClass('is-active');
				$('.sidePanel__navTabs .tabLinks').css('maxHeight', '');
				closestNavTab.addClass('is-active');
				uix.offcanvas.maxHeight(closestNavTab);
				uix.offcanvas.setIcon(closestNavTab.find('.js-offcanvasIcon'), 0);
			}
			return false;
		});

		$('#uix_offCanvasStatus').focus(function(e) {
			$('#visMenuSEdCountAlt').show();
		});

		uix.deviceSpecific.offCanvasTriggerInit();

		$('.js-leftPanelTrigger').on('click', function() {
			uix.offcanvas.move('left');
			return false;
		});
		$('.js-rightPanelTrigger').on('click', function() {
			uix.offcanvas.move('right');
			return false;
		});

		uix.offcanvas.exit.on('click', function() {
			uix.offcanvas.reset();
			return false;
		});

		uix.offcanvas.initTab();

		uix.tStamp('UIX.init.offCanvas Get', 1, pfTime);
	},

	initSet: function() {
		var pfTime = uix.time(),
			navTab = $('.sidePanel__navTabs .navTab.selected').closest('.navTab');
		uix.offcanvas.updateStatic();
		navTab.addClass('is-active');
		uix.offcanvas.setIcon(navTab.find('.js-offcanvasIcon'), 0);
		uix.offcanvas.setMaxHeight(navTab, uix.offcanvas.selectedHeight);
		uix.offcanvas.wrapper.removeClass('needsInit');
		uix.tStamp('UIX.init.offCanvas Set', 1, pfTime);
	},

	setIcon: function(ele, state) {
		if (uix.isSet(ele)) {
			if (state == 1) {
				ele.removeClass('uix_icon-collapseDropdown').addClass('uix_icon-expandDropdown');
			} else {
				ele.addClass('uix_icon-collapseDropdown').removeClass('uix_icon-expandDropdown');
			}
		}
	},

	move: function(direction) {
		window.requestAnimationFrame(function() {
			//uix.offcanvas.wrapper.addClass('is-panelMaskActive');

			uix.deviceSpecific.offCanvasMovePre();

			window.requestAnimationFrame(function() {
				uix.hideDropdowns.hide();
				if (direction == 'left') {
					uix.offcanvas.triggerLeft = true;
				} else if (direction == 'right') {
					uix.offcanvas.triggerRight = true;
				}
				uix.offcanvas.wrapper.addClass('is-' + direction + 'Triggered').addClass('is-' + direction + 'Showing').addClass('is-triggered').addClass('is-animating');
				uix.offcanvas.checkBoth();

				window.setTimeout(function() {
					uix.offcanvas.wrapper.removeClass('is-animating');
				}, uix.offcanvasTriggerAnimationDuration);

				uix.deviceSpecific.offCanvasMovePost();
			});
		});
	},

	removeAllTriggers: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		wrapper.addClass('is-leftShowing').addClass('is-rightShowing');
		uix.offcanvas.showingLeft = true;
		uix.offcanvas.showingRight = true;

		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.removeClass('is-leftTriggered').removeClass('is-rightTriggered').removeClass('is-triggered');
		} else if (uo.triggerLeft) {
			wrapper.removeClass('is-leftTriggered').removeClass('is-triggered');
		} else if (uo.triggerRight) {
			wrapper.removeClass('is-rightTriggered').removeClass('is-triggered');
		}
	},

	addAllTriggers: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		uix.offcanvas.showingLeft = false;
		uix.offcanvas.showingRight = false;

		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.addClass('is-leftTriggered').addClass('is-rightTriggered').addClass('is-triggered');
		} else if (uo.triggerLeft) {
			wrapper.addClass('is-leftTriggered').addClass('is-triggered').removeClass('is-rightShowing');
		} else if (uo.triggerRight) {
			wrapper.addClass('is-rightTriggered').addClass('is-triggered').removeClass('is-leftShowing');
		} else {
			wrapper.removeClass('is-leftShowing').removeClass('is-rightShowing');
		}
	},

	addBothLeftTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		wrapper.addClass('is-leftShowing');
		uix.offcanvas.showingLeft = true;
		uix.offcanvas.showingRight = false;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.removeClass('is-leftTriggered');
		} else if (uo.triggerLeft) {
			wrapper.removeClass('is-leftTriggered').removeClass('is-triggered');
		} else if (uo.triggerRight) {
			wrapper.addClass('is-rightTriggered').addClass('is-triggered');
		} else {
			wrapper.removeClass('is-rightShowing');
		}
	},

	addBothRightTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		wrapper.addClass('is-rightShowing');
		uix.offcanvas.showingLeft = false;
		uix.offcanvas.showingRight = true;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.removeClass('is-rightTriggered');
		} else if (uo.triggerRight) {
			wrapper.removeClass('is-rightTriggered').removeClass('is-triggered');
		} else if (uo.triggerLeft) {
			wrapper.addClass('is-leftTriggered').addClass('is-triggered');
		} else {
			wrapper.removeClass('is-leftShowing');
		}
	},

	addLeftTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		wrapper.addClass('is-leftShowing');
		uix.offcanvas.showingLeft = true;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.removeClass('is-leftTriggered');
		} else if (uo.triggerLeft) {
			wrapper.removeClass('is-leftTriggered').removeClass('is-triggered');
		}
	},

	addRightTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		wrapper.addClass('is-rightShowing');
		uix.offcanvas.showingRight = true;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.removeClass('is-rightTriggered');
		} else if (uo.triggerRight) {
			wrapper.removeClass('is-rightTriggered').removeClass('is-triggered');
		}
	},

	removeLeftTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		uix.offcanvas.showingLeft = false;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.addClass('is-leftTriggered');
		} else if (uo.triggerLeft) {
			wrapper.addClass('is-leftTriggered').addClass('is-triggered');
		} else {
			wrapper.removeClass('is-leftShowing');
		}
	},

	removeRightTriggered: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper;

		uix.offcanvas.showingRight = false;
		if (uo.triggerLeft && uo.triggerRight) {
			wrapper.addClass('is-rightTriggered');
		} else if (uo.triggerRight) {
			wrapper.addClass('is-rightTriggered').addClass('is-triggered');
		} else {
			wrapper.removeClass('is-rightShowing');
		}
	},

	updateStatic: function() {
		var uo = uix.offcanvas,
			wrapper = uo.wrapper,
			rightStatic = uix.offcanvasRightStatic,
			leftStatic = uix.offcanvasLeftStatic,
			rightStaticBreakpoint = uix.offcanvasRightStaticBreakpoint,
			leftStaticBreakpoint = uix.offcanvasLeftStaticBreakpoint,
			windowWidth = uix.windowWidth,
			rtl = XenForo.isRTL();
		if (uix.offcanvasLeftStatic || uix.offcanvasRightStatic) {
			if (wrapper.length === 0) {
				uix.offcanvas.wrapper = $('.js-uix_panels');
				wrapper = uo.wrapper;
				var selectedNavtab = $('.sidePanel__navTabs .navTab.selected');
				if (selectedNavtab.length) {
					selectedNavtab.addClass('is-active');
				}

				window.requestAnimationFrame(function() {
					wrapper.removeClass('needsInit');
				});
			}

			if (leftStatic && rightStatic) {
				if (windowWidth >= leftStaticBreakpoint && windowWidth >= rightStaticBreakpoint) {
					uo.removeAllTriggers();
				} else if (windowWidth >= leftStaticBreakpoint) {
					if (rtl) {
						uo.addBothRightTriggered();
					} else {
						uo.addBothLeftTriggered();
					}
				} else if (windowWidth >= rightStaticBreakpoint) {
					if (rtl) {
						uo.addBothLeftTriggered();
					} else {
						uo.addBothRightTriggered();
					}
				} else {
					uo.addAllTriggers();
				}
			} else if (leftStatic) {
				if (windowWidth >= leftStaticBreakpoint) {
					if (rtl) {
						uo.addRightTriggered();
					} else {
						uo.addLeftTriggered();
					}
				} else {
					if (rtl) {
						uo.removeRightTriggered();
					} else {
						uo.removeLeftTriggered();
					}
				}
			} else if (rightStatic) {
				if (windowWidth >= rightStaticBreakpoint) {
					if (rtl) {
						uo.addLeftTriggered();
					} else {
						uo.addRightTriggered();
					}
				} else {
					if (rtl) {
						uo.removeLeftTriggered();
					} else {
						uo.removeRightTriggered();
					}
				}
			}

			if (uix.offcanvas.showingLeft && !uix.offcanvas.triggerLeft) {
				$('.js-leftPanelTrigger').css('display', 'none');
			} else {
				$('.js-leftPanelTrigger').css('display', '');
			}

			if (uix.offcanvas.showingRight && !uix.offcanvas.triggerRight) {
				$('.js-rightPanelTrigger').css('display', 'none');
			} else {
				$('.js-rightPanelTrigger').css('display', '');
			}

			uix.offcanvas.checkBoth();
		}
	},

	checkBoth: function() {
		if ((uix.offcanvas.showingLeft || uix.offcanvas.triggerLeft) && (uix.offcanvas.showingRight || uix.offcanvas.triggerRight)) {
			uix.offcanvas.wrapper.addClass('is-bothShowing');
		} else {
			uix.offcanvas.wrapper.removeClass('is-bothShowing');
		}
	},

	maxHeight: function(ele) {
		uix.offcanvas.setMaxHeight(ele, uix.offcanvas.getMaxHeight(ele));
	},

	getMaxHeight: function(ele) {
		return $('.blockLinksList', ele).outerHeight() + 'px';
	},

	setMaxHeight: function(ele, val) {
		$('.tabLinks', ele).css('max-height', val);
	},

	reset: function() {
		window.requestAnimationFrame(function() {
			if (uix.offcanvas.triggerLeft) {
				if (uix.offcanvas.showingLeft) {
					uix.offcanvas.wrapper.removeClass('is-leftTriggered').removeClass('is-triggered');
				} else {
					uix.offcanvas.wrapper.removeClass('is-leftShowing').removeClass('is-leftTriggered').removeClass('is-triggered');
				}
			}

			if (uix.offcanvas.triggerRight) {
				if (uix.offcanvas.showingRight) {
					uix.offcanvas.wrapper.removeClass('is-rightTriggered').removeClass('is-triggered');
				} else {
					uix.offcanvas.wrapper.removeClass('is-rightShowing').removeClass('is-rightTriggered').removeClass('is-triggered');
				}
			}

			uix.offcanvas.triggerLeft = false;
			uix.offcanvas.triggerRight = false;
			uix.offcanvas.checkBoth();

			uix.offcanvas.wrapper.addClass('is-animating');

			window.setTimeout(function() {
				uix.offcanvas.wrapper.removeClass('is-animating');
			}, uix.offcanvasTriggerAnimationDuration);
			/*
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					uix.offcanvas.wrapper.removeClass('is-panelMaskActive');
				});
			}, 500);
			*/
			uix.sticky.check();
		});
	}
};

// #######################################################################################
// #																					 #
// #									Post Pagination									 #
// #																					 #
// #######################################################################################

audentio.pagination = {
	enabled: false,
	id: 'audentio_postPagination',
	displaySize: 800, // minimum display width in px to show on
	scrollDuration: 300, // duration of scroll to in ms
	sizeValid: false,
	needsInit: true,
	running: false,
	numPosts: 0,
	currentPost: 0,
	parent: null,
	threads: null,
	posts: [],
	uixSticky: true,
	input: null,
	dropdown: null,
	ele: null,
	scrollInterval: null,
	target: -1,
	lastPost: -1,
	listenersAdded: false,
	nextPage: '',
	prevPage: '',
	keyFn: function(event) {
		audentio.pagination.keyEvent(event);
	},
	offset: 0,
	parentEle: 'navigation',
	container: null,
	containerParent: null,
	containerRemoved: 0,
	popupMenu: null,
	useDropdown: true,
	outOfPhrase: 'Out of',
	enterIndexPhrase: 'Enter Index',
	additionalPages: false,

	init: function() {
		var ap = audentio.pagination;
		ap.initGet();
		ap.initSet();
	},

	initGet: function() {
		var ap = audentio.pagination,
			d = document,
			pfTime = uix.time(),
			parent = d.getElementById(ap.id),
			threads = d.getElementById('messageList');

		if (ap.id !== '' && uix.isSet(parent)  && uix.isSet(threads)) {
			audentio.pagination.windowWidth = window.innerWidth;

			audentio.pagination.parent = parent;
			audentio.pagination.threads = threads;
			if (ap.needsInit) {
				ap.updatePosts();
			}
		}
	},

	initSet: function() {
		var ap = audentio.pagination,
			d = document,
			pfTime = uix.time();

		if (uix !== undefined && uix.maxResponsiveWideWidth !== undefined) {
			audentio.pagination.displaySize = uix.maxResponsiveWideWidth;
		}
		if (ap.id !== '' && uix.isSet(ap.parent)  && uix.isSet(ap.threads)) {
			if (ap.needsInit) {
				audentio.pagination.enabled = true;
				var windowWidth = ap.windowWidth;

				var links = d.getElementsByTagName('LINK');
				for (var i = 0, len = links.length; i < len; i++) {
					if (links[i].rel == 'prev') {
						audentio.pagination.prevPage = links[i].href;
						audentio.pagination.additionalPages = true;
					}
					if (links[i].rel == 'next') {
						audentio.pagination.nextPage = links[i].href;
						audentio.pagination.additionalPages = true;
					}
				}

				if ((windowWidth > ap.displaySize) && (ap.numPosts > 1 || ap.additionalPages)) {

					var paginator = ap.makePaginator(windowWidth);
					ap.parent.appendChild(paginator);

					if (ap.useDropdown) {
						audentio.pagination.popupMenu = new XenForo.PopupMenu($(parent));
					}

					if (!uix.initDone) {
						uix.updateNavTabs = true;
					} else {
						uix.navTabs();
					}

					audentio.pagination.ele = paginator;
					ap.updateTotalPost(ap.numPosts);
					ap.updateCurrentPost();

					if (ap.useDropdown) {
						audentio.pagination.input = d.getElementById('audentio_postPaginationInput');
						audentio.pagination.dropdown = d.getElementById('audentio_postPaginationDropdown');
					}

					d.addEventListener('scroll', function(event) {
						ap.updateCurrentPost();
					});
					ap.updateBar();
					audentio.pagination.running = true;
					audentio.pagination.needsInit = false;

					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							ap.update();
							audentio.pagination.lastPost = ap.currentPost;
						});
					}, 100); // allow page to render

					ap.checkSize();

					var B = d.body,
						H = d.documentElement,
						docHeight = d.height;

					window.setInterval(function() {
						if (ap.running && uix.initDone) {
							var documentHeight = Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight, H.scrollHeight, H.offsetHeight);
							if (typeof docHeight !== 'undefined') {
								documentHeight = document.height; // For webkit browsers
							}

							if (documentHeight != uix.documentHeight) {
								uix.documentHeight = documentHeight;
								ap.update();
							}
						}
					}, 300);
				}
			} else {
				audentio.pagination.listenersAdded = true; //not in a threadList, don't add resize listeners
			}

			if (ap.listenersAdded === false) {
				if (ap.useDropdown) {
					if (ap.running) {
						ap.input.addEventListener('keypress', ap.keyFn);
					}
				}

				audentio.pagination.listenersAdded = true;
			}
		}
		uix.tStamp('Pagination Init', 2, pfTime);
	},

	makePaginator: function(windowWidth) {
		var ap = audentio.pagination;

		if (windowWidth < 1025) {
			audentio.pagination.useDropdown = false; // disable dropdown for tablet and mobile
		}

		content = '<a href=\"javascript: void(0)\" onclick=\"audentio.pagination.scrollToPost(0)\"><i class=\"fa fa-angle-double-up pointer fa-fw pagetop\"></i></a>';
		content += '<a href=\"javascript: void(0)\" onclick=\"audentio.pagination.prevPost()\"><i class=\"fa fa-angle-up pointer fa-fw pageup\"></i></a>';

		content += '<a href=\"javascript:void(0)\" class=\"uix_paginationMenu\">';
		content += '	<span>' + ap.outOfPhrase + '</span>';
		content += '</a>';

		content += '<a href=\"javascript: void(0)\" onclick=\"audentio.pagination.nextPost()\"><i class=\"fa fa-angle-down pointer fa-fw pagedown\"></i></a>';
		content += '<a href=\"javascript: void(0)\" onclick=\"audentio.pagination.scrollToPost(' + (ap.numPosts - 1) + ')\"><i class=\"fa fa-angle-double-down pointer fa-fw pagebottom\"></i></a>';
		content += '<div class=\"progress-container\">';
		content += '	<div class=\"progress-bar\" id=\"audentio_postPaginationBar\"></div>';
		content += '</div>';
		if (ap.useDropdown) {
			content += '	<div class=\"Menu\" id=\"audentio_postPaginationDropdown\">';
			content += '		<div class=\"primaryContent\">';
			content += '			<input type=\"text\" id=\"audentio_postPaginationInput\" class=\"textCtrl\" placeholder=\"' + ap.enterIndexPhrase + '\">';
			content += '		</div>';
			content += '	</div>';
		}

		var paginator = document.createElement('div');
		paginator.className = 'navLink';
		paginator.setAttribute('rel', 'Menu');
		paginator.innerHTML = content;
		return paginator;
	},

	update: function() {
		var ap = audentio.pagination,
			pfTime = uix.time();
		ap.checkSize();
		if (ap.sizeValid) {
			if (ap.needsInit) {
				ap.init(ap.id);
			} else if (ap.running) {
				ap.updatePosts();
				ap.updateCurrentPost();
			}
		}
		uix.tStamp('Pagination Update', 2, pfTime);
	},

	checkSize: function() {
		var ap = audentio.pagination,
			d = document,
			className = '';

		if (window.innerWidth > ap.displaySize) {
			audentio.pagination.sizeValid = true;
			if (ap.containerRemoved == 1 && ap.containerParent !== null && ap.container !== null) {
				ap.containerParent.appendChild(ap.container);
				if (!uix.initDone) {
					uix.updateNavTabs = true;
				} else {
					uix.navTabs();
				}
				audentio.pagination.containerRemoved = 0;
			}

			if (ap.running) {
				ap.ele.style.display = 'block';
				if (d.getElementById(ap.parentEle) !== null) {
					className = d.getElementById(ap.parentEle).className;
					if (className.indexOf('activePagination') == -1) {
						className += ' activePagination';
						d.getElementById(ap.parentEle).className = className;
					}
				}
			} else {
				if (ap.needsInit) {
					ap.init();
				}
			}
		} else {
			audentio.pagination.sizeValid = false;
			if (ap.running) {
				ap.ele.style.display = 'none';
				if (d.getElementById(ap.parentEle) !== null) {
					className = d.getElementById(ap.parentEle).className;
					if (className.indexOf('activePagination') > -1) {
						className = className.replace('activePagination', '');
						d.getElementById(ap.parentEle).className = className;
					}
				}
			}

			if (ap.containerRemoved === 0) {
				if (d.getElementById('audentio_postPagination') !== null) {
					if (!uix.initDone) {
						uix.updateNavTabs = true;
					} else {
						uix.navTabs();
					}
					audentio.pagination.containerRemoved = 1;
				}
			}
		}
	},

	keyEvent: function(event) {
		var key = event.which || event.keyCode, ap = audentio.pagination, d = document;
		if (key == 13) { // 13 is enter
			if (ap.useDropdown) {
				var index = parseInt(ap.input.value);
				if (index < 1) {
					index = 1;
				}
				if (index > ap.numPosts) {
					index = ap.numPosts;
				}
				audentio.pagination.input.value = '';
				ap.scrollToPost(index - 1);
				d.getElementById('audentio_postPaginationDropdown').style.display = 'none';
			}
		} else if (key == 37) { // left arrow
			//ap.prevPost();
		} else if (key == 39) { // right arrow
			//ap.nextPost();
		}
	},

	getOffset: function(num) {
		var ap = audentio.pagination;

		if (num - ap.currentPost > 0) { // scrolling down
			if (ap.uixSticky) {
				return uix.sticky.downStickyHeight + ap.offset;
			}
		} else {
			if (ap.uixSticky) {
				return uix.sticky.fullStickyHeight + ap.offset;
			}
		}
		return 0;
	},

	prevPost: function() {
		var ap = audentio.pagination;

		if (ap.target != -1) {
			window.scrollTo(0, ap.target);
			ap.updateCurrentPost();
		}
		var target = ap.currentPost - 1;
		if (target < 0) {
			if (ap.prevPage !== '') {
				window.location.href = ap.prevPage;
			}
			//target = 0;
		} else {
			if (ap.currentPost > 0) {
				ap.scrollToPost(target);
			}
		}

		return false;
	},

	nextPost: function() {
		var ap = audentio.pagination;

		if (ap.target != -1) {
			window.scrollTo(0, ap.target);
			ap.updateCurrentPost();
		}
		var target = ap.currentPost + 1;
		if (target >= ap.numPosts) {
			if (ap.nextPage !== '') {
				window.location.href = ap.nextPage;
			}
		} else {
			ap.scrollToPost(target);
		}
		return false;
	},

	scrollToPost: function(num) {
		uix.hideDropdowns.hide();

		var target = 0, ap = audentio.pagination, d = document, w = window;
		if (num >= ap.numPosts) {
			target = d.body.getBoundingClientRect().height;
		} else if (num >= 0) {
			target = ap.posts[num] - ap.getOffset(num);
			if (target !== target) {
				target = ap.posts[ap.posts.length - 1] - ap.getOffset(num);
			}
		}
		audentio.pagination.target = target;
		var startY = w.scrollY || window.pageYOffset || document.documentElement.scrollTop,
			numSteps = Math.ceil(ap.scrollDuration / 15),
			scrollStep = (startY - target) / numSteps,
			scrollCount = 0;

		clearInterval(ap.scrollInterval);

		if (ap.lastPost == num) {
			if (num <= 0 && ap.prevPage !== '') {
				w.location.href = ap.prevPage;
			}
			if (num >= (ap.numPosts - 1) && ap.nextPage !== '') {
				w.location.href = ap.nextPage;
			}
		} else {
			audentio.pagination.scrollInterval = setInterval(function() {
				if (scrollCount < numSteps && ap.target != -1) {
					scrollCount += 1;
					w.scrollTo(0, (startY - (scrollStep * scrollCount)));
				} else {
					clearInterval(ap.scrollInterval);
					w.scrollTo(0, target);
					audentio.pagination.target = -1;
					audentio.pagination.updateCurrentPost();
				}
			}, 16);
		}
		audentio.pagination.lastPost = num;
		return false;
	},

	updateNumPosts: function() {
		var posts = audentio.pagination.threads.getElementsByClassName('message'),
			count = 0;
		for (var i = 0, len = posts.length; i < len; i++) {
			if (posts[i].className.indexOf('deleted') < 0) {
				count = count + 1;
			}
		}

		audentio.pagination.numPosts = count;
	},

	updateCurrentPost: function() {
		var d = document, w = window, ap = audentio.pagination,
			scrollTop = uix.scrollTop,
			currentPost = 0;

		scrollTop += ap.getOffset() - 20;

		for (var i = 0; i < ap.numPosts - 1; i++) {
			if (scrollTop >= ap.posts[i]) {
				currentPost = i + 1;
			} else {
				break;
			}
		}
		if (d.getElementById('audentio_postPaginationCurrent') !== null) {
			d.getElementById('audentio_postPaginationCurrent').innerHTML = currentPost + 1;
			if (currentPost != ap.currentPost) {
				audentio.pagination.currentPost = currentPost;
				ap.updateBar();
				audentio.pagination.lastPost = currentPost;
			}
		}

		if (!uix.initDone) {
			uix.updateNavTabs = true;
		} else {
			uix.navTabs();
		} // update navigation to stop potential overflow
	},

	updateTotalPost: function(value) {
		var d = document;
		if (d.getElementById('audentio_postPaginationTotal') !== null) {
			d.getElementById('audentio_postPaginationTotal').innerHTML = value;
		}
	},

	updatePosts: function() {
		var ap = audentio.pagination;

		ap.updateNumPosts();
		var postCount = 0,
			posts = ap.threads.getElementsByClassName('message');
		for (var i = 0, len = posts.length; i < len; i++) {
			var post = posts[i];
			if (post.className.indexOf('deleted') < 0) {
				audentio.pagination.posts[postCount] = post.offsetTop;
				postCount = postCount + 1;
			}
		}
	},

	updateBar: function() {
		var ap = audentio.pagination;

		document.getElementById('audentio_postPaginationBar').style.width = ((ap.currentPost + 1) / ap.numPosts) * 100 + '%';
	}
};

uix.init.resizeFunctions = function() {
	var resizeTimer = null,
		endSResize = null;

	$(window).on('resize orientationchange', function(e) {
		if (uix.initDone) {
			resizeEvent();
		}
	});

	function resizeEvent() {
		if (resizeTimer === null) {
			resizeTimer = window.requestAnimationFrame(function() {
				resizeUpdate();
				resizeTimer = null;
				window.clearTimeout(endSResize);
			}); // set new timer
		} else {
			endSResize = setTimeout(function() {
				window.requestAnimationFrame(function() {
					resizeUpdate();
				});
			}, 250); // fire one last resize event
		}
	}

	function resizeUpdate() {
		var pfTime = uix.time();
		uix.viewport.init(); //update viewport variables

		if (uix.toggleWidthEnabled) {
			uix.toggleWidth.resize();
		}
		if (uix.enableBorderCheck) {
			uix.checkRadius.resize();
		}
		if (uix.offCanvasSidebar) {
			uix.userBar.check();
		}
		if (uix.sticky.running) {
			uix.sticky.resize();
		}
		if (uix.enableBorderCheck) {
			uix.checkRadius.checkGet(true);
		}

		uix.offcanvas.updateStatic();

		if (uix.messageSignature.needsInit) {
			uix.messageSignature.checkGet();
		}
		if (audentio.grid.running) {
			audentio.grid.update();
		}
		if (uix.elm.sidebar.length) {
			uix.sidebar.resize();
			uix.sidebar.update(); //updates sidebar css

			uix.sidebarSticky.resizeGet(); //update stickysidebar position
		}

		uix.init.searchClick();
		if (uix.smallLogo.running) {
			uix.smallLogo.resize();
		}
		if (uix.enableBorderCheck) {
			uix.ulManager.check();
		}
		if (audentio.pagination.enabled) {
			audentio.pagination.update();
		}
		if (uix.elm.sidebar.length && uix.sidebarSticky.running) {
			uix.sidebarSticky.resizeSet(); //update stickysidebar position
		}
		if (uix.enableBorderCheck) {
			uix.checkRadius.checkSet();
		}
		if (uix.messageSignature.needsInit) {
			uix.messageSignature.checkSet();
		}
		if (uix.stickyFooter.running) {
			uix.stickyFooter.check();
		}

		uix.navTabs();

		uix.tStamp('UIX.resizeUpdate', 1, pfTime);
	}
};

uix.init.scrollFunctions = function() {
	var scrollTimer = null,
		endScroll = null,
		lastScroll = -1,
		newScroll = false;

	$(window).on('scroll', function(e) {
		if (uix.initDone) {
			scrollEvent();
		}
	});

	function scrollEvent() {
		newScroll = true;
		if (scrollTimer === null) {
			scrollTimer = window.requestAnimationFrame(function() {
				scrollUpdate();
				scrollTimer = null;
				window.clearTimeout(endScroll);

				endScroll = setTimeout(function() {
					newScroll = false;
					momentumScroll(0);
				}, 50); // check for any momentum scrolling
			}); // set new timer
		}
	}

	function momentumScroll(depth) {
		if (depth < 6 && newScroll === false) {
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					scrollUpdate();
					momentumScroll(depth + 1);
				});
			}, 100);
		}
	}

	function scrollUpdate() {
		if (!uix.blockScrollEvents) {
			var pfTime = uix.time();
			if (uix.viewport.running) {
				uix.viewport.get();
			}

			if (uix.sticky.running) {
				uix.sticky.checkGet();
			}
			if (uix.smallLogo.running) {
				uix.smallLogo.checkGet();
			}

			if (uix.viewport.running) {
				uix.viewport.set();
			}
			if (uix.sticky.running) {
				uix.sticky.checkSet();
			}
			if (uix.sidebarSticky.running) {
				uix.sidebarSticky.check();
			}
			if (uix.jumpToFixedRunning) {
				uix.fn.jumpToFixed();
			}

			lastScroll = uix.scrollTop;
			uix.tStamp('UIX.scrollUpdate', 1, pfTime);
		}
	}
};

uix.setupAdminLinks = {
	queue: [],
	adminListTotal: -1,
	adminTotalEle: null,
	adminListClass: null,
	adminlistClassEle: null,

	init: function() {
		var us = uix.setupAdminLinks,
			pfTime = uix.time();
		us.initGet();
		us.initSet();
		uix.tStamp('UIX.setupAdminLinks.init', 1, pfTime);
	},

	addQueue: function(ele, className, wrap) {
		var us = uix.setupAdminLinks,
			foundIndex = -1;

		for (var i = 0, len = us.queue.length; i < len; i++) {
			if (ele == us.queue[i].ele) {
				foundIndex = i;
				break;
			}
		}

		if (foundIndex === -1) {
			uix.setupAdminLinks.queue.push({
				ele: ele,
				className: className,
				wrap: wrap
			});
		} else {
			if (className !== '') {
				uix.setupAdminLinks.queue[foundIndex].className += ' ' + className;
			}
			if (wrap) {
				uix.setupAdminLinks.queue[foundIndex].wrap = true;
			}
		}
	},

	initGet: function() {
		var us = uix.setupAdminLinks,
			modTabs = document.getElementsByClassName('moderatorTabs');
		if (uix.isSet(modTabs) && modTabs.length === 1) {
			var pfTime = uix.time(),
				modChildren = modTabs[0].children,
				modMenuAdmin = document.getElementsByClassName('uix_adminMenu'),
				adminListTotal = 0,
				adminListAlert = false,
				i,
				len,
				ele,
				eleTag,
				eleClass;

			for (i = 0, len = modChildren.length; i < len; i++) {
				ele = modChildren[i];

				if (uix.isSet(ele) && ele.nodeType === 1) {
					eleTag = ele.tagName;
					eleClass = ele.className;
					if (eleClass.indexOf('Popup') > -1) {
						var eleChildren = ele.children;
						for (var j = 0, len2 = eleChildren.length; j < len2; j++) {
							var eleChild = eleChildren[j];
							if (eleChild.nodeType === 1 && eleChild.className.indexOf('navLink') === -1) {
								us.addQueue(eleChild, 'navLink', false);
							}
						}
					} else if (eleTag != 'LI' && eleClass.indexOf('navLink') === -1) {
						if (eleTag != 'FORM') {
							us.addQueue(ele, 'navLink', false);
						}
					}
					us.addQueue(ele, 'uix_userbarRenderFix', false);

					if (eleTag != 'LI') { // wrap in li.navTab
						us.addQueue(ele, '', true);
					}
				}
			}

			if (modMenuAdmin.length === 1) {
				modMenuAdmin = modMenuAdmin[0];
				var modMenuChildren = modMenuAdmin.getElementsByClassName('blockLinksList'),
					adminTab = modTabs[0].getElementsByClassName('admin');

				if (modMenuChildren.length === 1) {
					modMenuChildren = modMenuChildren[0].children;
					for (i = 0, len = modMenuChildren.length; i < len; i++) {
						ele = modMenuChildren[i];
						if (ele.nodeType === 1) {
							eleTag = ele.tagName;
							eleClass = ele.className;
							if (eleTag != 'LI' && eleClass.indexOf('navLink') === -1) {
								if (eleTag != 'FORM') {
									us.addQueue(ele, 'navLink', false);
								}
							}

							if (eleTag != 'LI') { // wrap in li.navTab
								us.addQueue(ele, '', false);
							}

							if (adminTab.length === 1) {
								itemCount = ele.getElementsByClassName('itemCount');
								if (itemCount.length === 1) {
									var itemTotal = itemCount[0].getElementsByClassName('Total');
									if (itemTotal.length === 1) {
										adminListTotal += parseInt(itemTotal[0].innerHTML);
										if (!adminListAlert && itemCount[0].className.indexOf('alert') > -1) {
											adminListAlert = true;
										}
									}
								}
							}
						}
					}

					if (adminTab.length === 1 && adminListTotal > 0) {
						var adminItemCount = adminTab[0].getElementsByClassName('itemCount');
						if (adminItemCount.length === 1) {
							var newClassName = adminItemCount[0].className,
								adminTotal = adminItemCount[0].getElementsByClassName('Total');

							if (adminTotal.length === 1) {
								uix.setupAdminLinks.adminListTotal = adminListTotal;
								uix.setupAdminLinks.adminTotalEle = adminTotal[0];
								newClassName = newClassName.replace('Zero', '');
								if (adminListAlert) {
									newClassName += ' alert';
								}
								uix.setupAdminLinks.adminListClass = newClassName;
								uix.setupAdminLinks.adminlistClassEle = adminItemCount[0];
							}
						}
					}
				}
			}

			uix.tStamp('UIX.setupAdminLinks.initGet', 1, pfTime);
		}
	},

	initSet: function() {
		var us = uix.setupAdminLinks,
			pfTime = uix.time();

		if (us.adminListTotal > -1) {
			us.adminTotalEle.innerHTML = us.adminListTotal;
		}

		if (uix.isSet(us.adminListClass)) {
			us.adminlistClassEle.className = us.adminListClass;
		}

		for (var i = 0, len = us.queue.length; i < len; i++) {
			var item = us.queue[i];

			if (item.className !== '') {
				item.ele.className += ' ' + item.className;
			}

			if (item.wrap) {
				var ele = item.ele,
					eleParent = ele.parentNode,
					wrapper = document.createElement('li'),
					nextSib = ele.nextSibling;

				if (ele.tagName == 'FORM') {
					var wrapper2 = document.createElement('span');
					wrapper2.className = 'navLink';
					wrapper2.appendChild(ele);
					wrapper.appendChild(wrapper2);
				} else {
					wrapper.appendChild(ele);
				}
				wrapper.className = 'navTab uix_userbarRenderFix';
				if (uix.isSet(nextSib)) {
					eleParent.insertBefore(wrapper, nextSib);
				} else {
					eleParent.appendChild(wrapper);
				}
			}
		}
		uix.tStamp('UIX.setupAdminLinks.initSet', 1, pfTime);
	}
};

// #######################################################################################
// #																					 #
// #								UIX Sidebar Functions								 #
// #																					 #
// #######################################################################################

uix.sidebar = {
	collapseEle: '',
	visible: 1,
	marginDirection: 'marginRight',
	needsInit: true,

	findMarginDirection: function() {
		if (uix.RTL) {
			uix.sidebar.marginDirection = (uix.sidebarLocation) ? 'marginRight' : 'marginLeft';
		} else {
			uix.sidebar.marginDirection = (uix.sidebarLocation) ? 'marginLeft' : 'marginRight';
		}
	},

	initGeneral: function() {
		uix.sidebar.collapseEle = $('.js-sidebarToggle');
		uix.sidebar.findMarginDirection();

		uix.sidebar.needsInit = false;
	},

	initLoad: function() {
		var us = uix.sidebar;

		if (uix.user.sidebarState === 1) {
			uix.sidebar.visible = 0;
		}

		window.requestAnimationFrame(function() {
			if (uix.isSet(uix.elm) && uix.isSet(uix.elm.mainContent)) {
				uix.elm.mainContent.addClass('withTransition');
			}
		});
	},

	showClick: function() {
		var us = uix.sidebar,
			ele = uix.elm.sidebar;

		uix.elm.html.removeClass('is-sidebarCollapsed').addClass('is-sidebarOpen');

		//us.collapseEle.removeClass('uix_sidebar_collapsed');
		us.setIcon(1);
		var stickyCondition = (uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth && !uix.sidebarSticky.running && !uix.stickyForceDisable && uix.user.stickyEnableSidebar);

		if (uix.sidebarSticky.running) {
			uix.sidebarSticky.unstick();
		}
		window.requestAnimationFrame(function() {
			ele.css({'opacity': '0'}); // on refresh, still want to be 0 so it can fade in
			window.requestAnimationFrame(function() {
				if (uix.windowWidth > uix.sidebarMaxResponsiveWidth) {
					uix.elm.mainContent.css(uix.sidebar.marginDirection, uix.mainContainerMargin);
					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							ele.css({'display': 'block'});
							window.requestAnimationFrame(function() {
								ele.css({'opacity': '1'});
								window.setTimeout(function() {
									uix.resizeFire();
									uix.sidebar.visible = 1;
									if (stickyCondition) {
										uix.sidebarSticky.init();
									}
								}, 400); // fix notices
							});
						});
					}, 400);
				} else {
					ele.css({'display': '', 'opacity': ''});
					uix.elm.mainContent.css(uix.sidebar.marginDirection, 0);
					uix.resizeFire();
					uix.sidebar.visible = 1;
				}
			});
		});
	},

	setIcon: function(state) {
		if (uix.sidebarInnerFloat == 'right') {
			if (state == 1) {
				$('.js-sidebarToggleIcon').addClass('uix_icon-collapseRightSidebar').removeClass('uix_icon-expandRightSidebar');
			} else {
				$('.js-sidebarToggleIcon').removeClass('uix_icon-collapseRightSidebar').addClass('uix_icon-expandRightSidebar');
			}
		} else {
			if (state == 1) {
				$('.js-sidebarToggleIcon').addClass('uix_icon-collapseLeftSidebar').removeClass('uix_icon-expandLeftSidebar');
			} else {
				$('.js-sidebarToggleIcon').removeClass('uix_icon-collapseLeftSidebar').addClass('uix_icon-expandLeftSidebar');
			}
		}
	},

	hideClick: function() {
		var us = uix.sidebar,
			ele = uix.elm.sidebar;

		uix.elm.html.addClass('is-sidebarCollapsed').removeClass('is-sidebarOpen');

		window.requestAnimationFrame(function() {
			//us.collapseEle.addClass('uix_sidebar_collapsed');
			us.setIcon(0);
			ele.css({'opacity': '0'});

			window.requestAnimationFrame(function() {
				if (uix.windowWidth > uix.sidebarMaxResponsiveWidth) {
					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							uix.sidebar.visible = 0;
							ele.css({'display': 'none'});
							uix.elm.mainContent.css(uix.sidebar.marginDirection, 0);
							window.setTimeout(function() {
								window.requestAnimationFrame(function() {
									if (uix.sidebarSticky.running) {
										uix.sidebarSticky.unstick();
									}
									uix.resizeFire();
								});
							}, 400); // fix notices
						});
					}, 400);
				}
			});
		});
	},

	initClick: function() {
		uix.sidebar.collapseEle.find('a').on('click', function(e) {
			e.preventDefault();
			if (uix.sidebar.visible == 1) {
				uix.sidebar.hideClick();
			} else {
				uix.sidebar.showClick();
			}

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						content = xmlhttp.responseText;
					}
				}
			};

			xmlhttp.open('GET', uix.ajaxSidebarToggleLink, true);
			xmlhttp.send();

		});
	},

	init: function() {
		var pfTime = uix.time(),
			us = uix.sidebar;

		us.initGet();
		us.initSet();
		uix.tStamp('UIX.sidebar.init', 1, pfTime);
	},

	initGet: function() {
		var pfTime = uix.time(),
			ele = uix.elm.sidebar;

		if (uix.sidebar.needsInit) {
			uix.sidebar.initGeneral();
		}

		if (ele.length) {
			if (uix.collapsibleSidebar && uix.canCollapseSidebar == '1') {
				uix.sidebar.initClick();
			}
		}
		uix.tStamp('UIX.sidebar.initGet', 1, pfTime);
	},

	initSet: function() {
		var pfTime = uix.time(),
			ele = uix.elm.sidebar;

		if (ele.length) {
			if (uix.collapsibleSidebar && uix.canCollapseSidebar == '1') {
				uix.sidebar.initLoad();
			}
			uix.sidebar.update();//updates sidebar css
		}
		uix.tStamp('UIX.sidebar.initSet', 1, pfTime);
	},

	update: function() {
		if (uix.windowWidth <= uix.sidebarMaxResponsiveWidth && uix.sidebarSticky.length && uix.elm.sidebarInnerWrapper.length && uix.sidebarSticky.running) {
			uix.elm.sidebarInnerWrapper.css({
				'top': ''
			});
		}
	},

	resize: function() {
		var pfTime = uix.time();

		if (uix.windowWidth <= uix.sidebarMaxResponsiveWidth) {
			uix.elm.mainContent.removeClass('withTransition');
			uix.elm.mainContent.css({
				'marginRight': 0,
				'marginLeft': 0
			});
		} else {
			if (!uix.elm.mainContent.hasClass('withTransition')) {
				window.setTimeout(function() {
					uix.elm.mainContent.addClass('withTransition');
				}, 100);
			}
			if (uix.sidebar.visible == 1) {
				uix.elm.mainContent.css(uix.sidebar.marginDirection, uix.mainContainerMargin);
			}
		}

		uix.tStamp('UIX.sidebar.resize', 2, pfTime);
	}
};

// #######################################################################################
// #																					 #
// #									UIX Small Logo									 #
// #																					 #
// #######################################################################################

uix.smallLogo = {
	needsInit: true,
	logoTopOffset: 0,
	logoOuterHeight: 0,
	stickyWrapper: null,
	stickyWrapperOffsetTop: 0,
	stickyWrapperOuter: 0,
	visible: 0,
	running: false,

	init: function() {
		uix.smallLogo.initGet();
		uix.smallLogo.initSet();
	},

	initGet: function() {
		if (uix.elm.logoSmall.length && uix.elm.logo.length) {
			uix.smallLogo.stickyWrapper = uix.elm.navigation.find('.sticky_wrapper');
			uix.smallLogo.resize();
			uix.smallLogo.checkGet();
		}
	},

	initSet: function() {
		uix.smallLogo.needsInit = false;
		if (uix.elm.logoSmall.length && uix.elm.logo.length) {
			uix.smallLogo.checkSet();
			uix.smallLogo.running = true;
		}
	},

	checkGet: function() {

	},

	checkSet: function() {
		var us = uix.smallLogo;

		if (uix.sticky.getState('#navigation') == 1) {
			var logoTopOffset = us.logoTopOffset + us.logoOuterHeight,
				navigationBottomOffset = uix.scrollTop;

			if (logoTopOffset < navigationBottomOffset) {
				if (us.visible === 0) {
					uix.smallLogo.addLogo();
				}
			} else {
				if (us.visible == 1) {
					uix.smallLogo.removeLogo();
				}
			}
		} else {
			if (us.visible == 1) {
				uix.smallLogo.removeLogo();
			}
		}
	},

	addLogo: function() {
		uix.smallLogo.visible = 1;

		var pfTime2 = uix.time();
		uix.elm.html.addClass('activeSmallLogo');
		if (!uix.initDone) {
			uix.updateNavTabs = true;
		} else {
			uix.navTabs();
			if (uix.enableBorderCheck) {
				uix.ulManager.check();
			}
		}
		uix.tStamp('uix.navTabs', 3, pfTime2);
	},

	removeLogo: function() {
		uix.smallLogo.visible = 0;

		var pfTime2 = uix.time();
		uix.elm.html.removeClass('activeSmallLogo');

		if (!uix.initDone) {
			uix.updateNavTabs = true;
		} else {
			uix.navTabs();
			if (uix.enableBorderCheck) {
				uix.ulManager.check();
			}
		}
		uix.tStamp('uix.navTabs', 3, pfTime2);
	},

	check: function() {
		var us = uix.smallLogo,
			pfTime = uix.time();

		if (us.needsInit) {
			us.init();
		}
		us.checkGet();
		us.checkSet();

		uix.tStamp('UIX.smallLogo.check', 2, pfTime);
	},

	resize: function() {
		uix.smallLogo.logoOuterHeight = uix.elm.logo.outerHeight(true) / 2;
		uix.smallLogo.logoTopOffset = uix.elm.logo.offset().top;
		uix.smallLogo.stickyWrapperOuter = uix.smallLogo.stickyWrapper.outerHeight(true);
	}
};

// #######################################################################################
// #																					 #
// #								UIX Sticky Functions								 #
// #																					 #
// #######################################################################################

uix.sticky = {
	items: [],
	allInitItemsAdded: false,
	stickyHeight: 0,
	fullStickyHeight: 0,
	downStickyHeight: 0,
	stickyElmsHeight: 0,
	pfLog: false,
	betaMode: false,
	running: false,
	stickyLastBottom: 0,
	lastScrollTop: 0,
	scrollStart: 0, // the position that a scroll starts
	scrollDistance: 0, // counter of the distance of the current scroll
	scrollDirection: 'start', // neither up nor down intentionally
	scrollClass: '',
	scrollLastClass: '',
	preventStickyTop: false, // stops sliding sticky from sticking during jump to top
	stickyMinPos: 350, // if scrollDetector enabled, won't sticky before this value
	stickyOffsetDist: 0, // the amount to position offscreen sticky elements
	stickyMinDist: 20, // min distance for a scroll to trigger sticky hide or show
	scrollDetectorRunning: false, // boolean if the scrollDetector is running
	scrollTop: window.scrollY || document.documentElement.scrollTop,
	html: $('html'),
	needsInit: true,
	windowWidth: 0,
	windowHeight: 0,
	landscapeOrientation: true,
	minWidthDefault: 0,
	maxWidthDefault: 999999,
	minHeightDefault: 0,
	maxHeightDefault: 999999,
	minWidthPortraitDefault: 0,
	maxWidthPortraitDefault: 999999,
	minHeightPortraitDefault: 0,
	maxHeightPortraitDefault: 999999,
	noSubEle: 0,
	postAddFunc: function() {},
	postStickFunc: function() {},
	postUnstickFunc: function() {},
	postDelayUnstickFunc: function() {},
	preDelayUnstickFunc: function() {},

	set: function(o) {
		if (o !== undefined) {
			if (o.betaMode !== undefined) {
				uix.sticky.betaMode = o.betaMode;
			}
			if (o.pfLog !== undefined) {
				uix.sticky.pfLog = o.pfLog;
			}
			if (o.stickyMinPos !== undefined) {
				uix.sticky.stickyMinPos = o.stickyMinPos;
			}
			if (o.stickyMinDist !== undefined) {
				uix.sticky.stickyMinDist = o.stickyMinDist;
			}
			if (o.minWidthDefault !== undefined) {
				uix.sticky.minWidthDefault = o.minWidthDefault;
			}
			if (o.maxWidthDefault !== undefined) {
				uix.sticky.maxWidthDefault = o.maxWidthDefault;
			}
			if (o.minHeightDefault !== undefined) {
				uix.sticky.minHeightDefault = o.minHeightDefault;
			}
			if (o.maxHeightDefault !== undefined) {
				uix.sticky.maxHeightDefault = o.maxHeightDefault;
			}

			if (o.minWidthPortraitDefault !== undefined) {
				uix.sticky.minWidthPortraitDefault = o.minWidthPortraitDefault;
			}
			if (o.maxWidthPortraitDefault !== undefined) {
				uix.sticky.maxWidthPortraitDefault = o.maxWidthPortraitDefault;
			}
			if (o.minHeightPortraitDefault !== undefined) {
				uix.sticky.minHeightPortraitDefault = o.minHeightPortraitDefault;
			}
			if (o.maxHeightPortraitDefault !== undefined) {
				uix.sticky.maxHeightPortraitDefault = o.maxHeightPortraitDefault;
			}

			if (o.postAddFunc !== undefined) {
				uix.sticky.postAddFunc = o.postAddFunc;
			}
			if (o.postStickFunc !== undefined) {
				uix.sticky.postStickFunc = o.postStickFunc;
			}
			if (o.postUnstickFunc !== undefined) {
				uix.sticky.postUnstickFunc = o.postUnstickFunc;
			}
			if (o.postDelayUnstickFunc !== undefined) {
				uix.sticky.postDelayUnstickFunc = o.postDelayUnstickFunc;
			}
			if (o.preDelayUnstickFunc !== undefined) {
				uix.sticky.preDelayUnstickFunc = o.preDelayUnstickFunc;
			}
		}
	},

	init: function() {
		uix.sticky.initGet();
		uix.sticky.initSet();
	},

	initGet: function() {
		uix.sticky.viewport();
		uix.sticky.set({
			betaMode: uix.betaMode,
			pfLog: uix.pfLog,
			minWidthDefault: uix.stickyNavigationMinWidth,
			maxWidthDefault: uix.stickyNavigationMaxWidth,
			minHeightDefault: uix.stickyNavigationMinHeight,
			maxHeightDefault: uix.stickyNavigationMaxHeight,
			minWidthPortraitDefault: uix.stickyNavigationPortraitMinWidth,
			maxWidthPortraitDefault: uix.stickyNavigationPortraitMaxWidth,
			minHeightPortraitDefault: uix.stickyNavigationPortraitMinHeight,
			maxHeightPortraitDefault: uix.stickyNavigationPortraitMaxHeight,
			stickyMinPos: uix.stickyGlobalMinimumPosition,
			postAddFunc: function() {
				//window.requestAnimationFrame(uix.fixScrollLocation.init);
			},
			postStickFunc: function(eles) {
				window.requestAnimationFrame(function() {
					if (uix.isSet(eles) && eles.indexOf('navigation') > -1) {
						window.setTimeout(function() {uix.navTabs();}, 0);
					}
					uix.hideDropdowns.hide();
				});
			},
			postUnstickFunc: function(eles) {
				window.requestAnimationFrame(function() {
					if (uix.isSet(eles) && eles.indexOf('navigation') > -1) {
						window.setTimeout(function() {uix.navTabs();}, 0);
					}
					if (uix.enableBorderCheck) {
						uix.checkRadius.check();
					}
					uix.hideDropdowns.hide();
				});
			},
			postDelayUnstickFunc: function() {
				if (uix.sidebarSticky.running) {
					uix.sidebarSticky.check();
				}
				if (uix.enableBorderCheck) {
					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							uix.checkRadius.check();
						});
					}, 100);
				}
				uix.slidingSidebar = true;
				uix.hideDropdowns.hide();
			},
			preDelayUnstickFunc: function() {
				if (uix.sidebarSticky.running) {
					if (uix.elm.sidebar.length && uix.stickySidebar && uix.elm.sidebarInnerWrapper) {
						if (uix.sidebarSticky.bottomFixed === 0) { // bit of a hack, but stops sidebar flicker
							uix.elm.sidebarInnerWrapper.css({
								transition: 'top 0.2s'
							});
						} else {
							uix.elm.sidebarInnerWrapper.css({
								transition: 'top 0s'
							}); // remove transition to stop flicker
							uix.slidingSidebar = false;
						}
					}
					uix.sidebarSticky.check();
				}
			}
		});

		var stickySel = $('.stickyTop');
		for (var i = 0, len = stickySel.length; i < len; i++) {
			var item = '#' + stickySel[i].id;
			if (uix.stickyItems[item] !== undefined && uix.sticky.hasItem(item) === false) {
				uix.sticky.add(item, uix.stickyItems[item].normalHeight, uix.stickyItems[item].stickyHeight, uix.stickyItems[item].options);
			}
		}
		uix.sticky.initItemsAddedGet();
	},

	initSet: function() {
		uix.sticky.needsInit = false;
		uix.sticky.initItemsAddedSet();
	},

	initItemsAdded: function() {
		var us = uix.sticky,
			pfTime = uix.time();
		us.initItemsAddedGet();
		us.initItemsAddedSet();
		uix.tStamp('UIX.sticky.initItemsAdded', 2, pfTime);
	},

	initItemsAddedGet: function() {
		var us = uix.sticky,
			pfTime = uix.time();
		uix.sticky.allInitItemsAdded = true;

		for (var i = 0, len = us.items.length; i < len; i++) {
			us.checkSize(i); // see if item sticky is enabled at current size
		}
		uix.sticky.running = true;

		us.checkGet();
		uix.tStamp('UIX.sticky.initItemsAddedGet', 2, pfTime);
	},

	initItemsAddedSet: function() {
		var us = uix.sticky,
			pfTime = uix.time();

		for (var i = 0, len = us.items.length; i < len; i++) {
			var item = us.items[i];
			if (item.name === '#navigation' && (item.subElement === null || !item.subElement.length)) {
				item.elm.addClass('uix_noTabLinks').addClass('inactiveSticky');
			}
		}

		us.checkSet();
		us.postAddFunc();
		uix.tStamp('UIX.sticky.initItemsAddedSet', 2, pfTime);
	},

	add: function(itemName, normalHeight, stickyHeight, o) {
		var us = uix.sticky,
			pfTime = uix.time();

		var item = {
			name: itemName,
			elm: $(itemName),
			docElm: document.getElementById(itemName.replace('#', '')),
			state: 0,
			transitionState: 0,
			subElement: null,
			subCheckSize: 0,
			subNormalHeight: 0,
			subStickyHeight: 0,
			subStickyHide: false,
			subStickyHideClassAdded: false,
			itemFromWindowTop: null,
			wrapperFromWindowTop: null

		};
		var rect = item.elm[0].getBoundingClientRect();
		item.offset = {top: rect.top + uix.scrollTop};

		if (o === undefined) {
			item.maxWidth = us.maxWidthDefault;
			item.minWidth = us.minWidthDefault;
			item.maxHeight = us.maxHeightDefault;
			item.minHeight = us.minHeightDefault;
			item.maxWidthPortrait = us.maxWidthPortraitDefault;
			item.minWidthPortrait = us.minWidthPortraitDefault;
			item.maxHeightPortrait = us.maxHeightPortraitDefault;
			item.minHeightPortrait = us.minHeightPortraitDefault;
			item.scrollSticky = 1;
		} else {
			item.maxWidth = (o.maxWidth === undefined ? us.maxWidthDefault : o.maxWidth);
			item.minWidth = (o.minWidth === undefined ? us.minWidthDefault : o.minWidth);
			item.maxHeight = (o.maxHeight === undefined ? us.maxHeightDefault : o.maxHeight);
			item.minHeight = (o.minHeight === undefined ? us.minHeightDefault : o.minHeight);

			item.maxWidthPortrait = (o.maxWidthPortrait === undefined ? us.maxWidthPortraitDefault : o.maxWidthPortrait);
			item.minWidthPortrait = (o.minWidthPortrait === undefined ? us.minWidthPortraitDefault : o.minWidthPortrait);
			item.maxHeightPortrait = (o.maxHeightPortrait === undefined ? us.maxHeightPortraitDefault : o.maxHeightPortrait);
			item.minHeightPortrait = (o.minHeightPortrait === undefined ? us.minHeightPortraitDefault : o.minHeightPortrait);

			item.scrollSticky = (o.scrollSticky === undefined ? 1 : o.scrollSticky);
			item.subElement = (o.subElement === undefined ? null : $(o.subElement));
			item.subNormalHeight = ((o.subNormalHeight === undefined || item.subElement === null || !item.subElement.length) ? 0 : o.subNormalHeight);
			item.subStickyHeight = ((o.subStickyHeight === undefined || item.subElement === null || !item.subElement.length) ? 0 : o.subStickyHeight);
			item.subStickyHide = ((o.subStickyHide === undefined || item.subElement === null || !item.subElement.length) ? false : o.subStickyHide);
		}
		if (item.scrollSticky) {
			us.scrollDetectorRunning = true;
		}

		if (o.subStickyHide) {
			item.subStickyHeight = 0;
		}
		item.normalHeight = normalHeight + item.subNormalHeight;
		item.stickyHeight = stickyHeight + item.subStickyHeight;
		uix.sticky.fullStickyHeight += item.stickyHeight;
		if (item.scrollSticky === 0) {
			uix.sticky.downStickyHeight += item.stickyHeight;
		}

		if (item.normalHeight > item.stickyHeight) {
			uix.sticky.stickyOffsetDist += item.normalHeight;
		} else {
			uix.sticky.stickyOffsetDist += item.stickyHeight;
		}

		uix.sticky.stickyLastBottom = item.offset.top + item.elm[0].offsetHeight;

		item.wrapper = item.elm.find('.sticky_wrapper');

		if (uix.userBar.enableHiding && !uix.userBar.userbarSet) {
			if (item.name === '#userBar') {
				if (item.minWidth < uix.offCanvasTriggerWidth) {
					item.minWidth = uix.offCanvasTriggerWidth;
				}
				if (item.minWidthPortrait < uix.offCanvasTriggerWidth) {
					item.minWidthPortrait = uix.offCanvasTriggerWidth;
				}
			}
		}

		uix.sticky.items.push(item);

		if (us.allInitItemsAdded) {
			us.initItemsAdded(); // initializes things, don't want to run unless adding an item after setup is complete
		}

		uix.tStamp('UIX.sticky.add ' + itemName, 2, pfTime);
	},

	hasItem: function(itemName) {
		var usi = uix.sticky.items;
		for (var x = 0, len = usi.length; x < len; x++) {
			if (usi[x].name == itemName) {
				return true;
			}
		}
		return false;
	},

	remove: function(itemName) {
		var us = uix.sticky;
		for (var x = 0, len = us.items.length; x < len; x++) {
			if (us.items[x].name == itemName) {
				uix.fullStickyHeight -= us.items[x].stickyHeight;
				uix.sticky.items.splice(x, 1);
			}
		}
		us.check();
	},

	stick: function(index, currentHeight) {
		var us = uix.sticky,
			currentItem = us.items[index],
			target = currentItem.elm,
			innerWrapper = currentItem.wrapper,
			normalHeight = currentItem.normalHeight,
			pfTime = uix.time();

		$('.lastSticky').removeClass('lastSticky');
		target.addClass('lastSticky').removeClass('inactiveSticky').addClass('activeSticky').css('height', normalHeight);

		if (currentItem.scrollSticky) {
			innerWrapper.css('top', (currentHeight - us.stickyOffsetDist)); // offset so items can scroll
		} else {
			innerWrapper.css({'top': currentHeight});
		}

		uix.sticky.items[index].state = 1;
		uix.tStamp('UIX.sticky.stick ' + currentItem.name , 2, pfTime);
	},

	unstick: function(index) {
		var us = uix.sticky,
			currentItem = us.items[index],
			target = currentItem.elm,
			innerWrapper = currentItem.wrapper,
			stickyHeight = currentItem.stickyHeight,
			pfTime = uix.time();

		target.addClass('inactiveSticky').removeClass('lastSticky').removeClass('activeSticky').css({'height': ''});

		innerWrapper.css({'top': ''});

		uix.sticky.items[index].state = 0;
		if (currentItem.state != 2) {
			$('.activeSticky').last().addClass('lastSticky');
		}

		uix.tStamp('UIX.sticky.unstick ' + currentItem.name, 2, pfTime);
	},

	delayUnstick: function(preUnstick) { // unsticks everything with state == 2, used for scroll sticky
		var us = uix.sticky,
			unstickDone = false;

		for (var x = 0, len = us.items.length; x < len; x++) {
			if (us.items[x].state == 2) {
				if (preUnstick === true) {
					us.unstick(x);
				}
				us.items[x].wrapper.css({
					'-webkit-transform': '',
					'-ms-transform': '',
					'-moz-transform': '',
					'transform': ''
				});
				uix.sticky.items[x].transitionState = 0;
				if (preUnstick !== true) {
					us.unstick(x);
				}
				unstickDone = true;
			}
		}
		if (unstickDone) {
			if (preUnstick !== true) {
				uix.sidebarSticky.resize();
			}
			$('.activeSticky').last().addClass('lastSticky');
			us.postDelayUnstickFunc();
		}
	},

	delayStick: function() {
		var us = uix.sticky,
			stickDone = false;

		for (var x = 0, len = us.items.length; x < len; x++) {
			if (us.items[x].state == 3) {
				stickDone = true;
				us.items[x].wrapper.css({
					'-webkit-transform': 'translate3d(0, ' + uix.sticky.stickyOffsetDist + 'px, 0)',
					'-ms-transform': 'translate3d(0, ' + us.stickyOffsetDist + 'px, 0)',
					'-moz-transform': 'translate3d(0, ' + us.stickyOffsetDist + 'px, 0)',
					'transform': 'translate3d(0, ' + us.stickyOffsetDist + 'px, 0)'
				}); // move to scroll in
				uix.sticky.items[x].transitionState = 2;
				uix.sticky.items[x].state = 1;
			}
		}
		if (stickDone) {
			uix.sidebarSticky.resize();
		}
	},

	checkGet: function() {
		var us = uix.sticky;

		if (us.scrollDetectorRunning) {
			us.scrollDetectorGet();
		}

		for (var x = 0, len = us.items.length; x < len; x++) {
			var currentItem = us.items[x];
			if (currentItem.enabled) {
				if (uix.isSet(currentItem.wrapper[0])) {
					uix.sticky.items[x].itemFromWindowTop = currentItem.docElm.getBoundingClientRect().top;
					uix.sticky.items[x].wrapperFromWindowTop = currentItem.wrapper[0].getBoundingClientRect().top;
				}
			}
		}
	},

	checkSet: function() {
		var us = uix.sticky,
			currentStickyHeight = 0,
			needsDelayStick = false,
			needsDelayUnstick = false,
			needsPostStick = false,
			needsPostUnstick = false,
			newStickEles = '',
			newUnstickEles = '';

		if (us.scrollDetectorRunning) {
			us.scrollDetectorSet();
		}

		for (var x = 0, len = us.items.length; x < len; x++) {
			var currentItem = us.items[x];
			if (currentItem.enabled) {
				var itemFromWindowTop = currentItem.itemFromWindowTop,
					innerWrapper = currentItem.wrapper,
					wrapperFromWindowTop = currentItem.wrapperFromWindowTop,
					wrapperFromWindowTopInit = wrapperFromWindowTop;
				if (wrapperFromWindowTop < currentStickyHeight) {
					wrapperFromWindowTop = currentStickyHeight; // fix for iOS
				}
				if (us.scrollDetectorRunning && currentItem.scrollSticky == 1) {
					if (us.scrollTop <= us.stickyMinPos) {
						us.delayUnstick(true);
						if (currentItem.transitionState !== 0) {
							innerWrapper.css({
								'-webkit-transform': '',
								'-ms-transform': '',
								'-moz-transform': '',
								'transform': ''
							});
							uix.sticky.items[x].transitionState = 0;
						}
					} else if (us.scrollTop > us.stickyMinPos && us.scrollDirection == 'down' && (itemFromWindowTop < wrapperFromWindowTop && us.scrollDistance > us.stickyMinDist) && currentItem.transitionState != 1) {
						innerWrapper.css({
							'-webkit-transform': 'translate3d(0, 0, 0)',
							'-ms-transform': 'translate3d(0, 0, 0)',
							'-moz-transform': 'translate3d(0, 0, 0)',
							'transform': 'translate3d(0, 0, 0)'
						});
						uix.sticky.items[x].transitionState = 1;
					}

					if (currentItem.state == 1) { //Is stuck
						if ((itemFromWindowTop > wrapperFromWindowTop) || (us.scrollDirection == 'down' && us.scrollDistance > us.stickyMinDist) || us.scrollTop <= us.stickyMinPos) {
							innerWrapper.css({
								'-webkit-transform': 'translate3d(0, 0, 0)',
								'-ms-transform': 'translate3d(0, 0, 0)',
								'-moz-transform': 'translate3d(0, 0, 0)',
								'transform': 'translate3d(0, 0, 0)'
							});
							uix.sticky.items[x].transitionState = 1;
							uix.sticky.items[x].state = 2; // prevent any additional sticking or unsticking until it is unstuck
							needsDelayUnstick = true;
							us.subElementCheck(x, currentStickyHeight, itemFromWindowTop);
						} else {
							us.subElementCheck(x, currentStickyHeight, itemFromWindowTop);
							currentStickyHeight += currentItem.stickyHeight;
						}
					} else if (currentItem.state === 0 && us.preventStickyTop === false) { //Not stuck
						if (wrapperFromWindowTopInit - currentStickyHeight <= 0 && us.scrollDirection == 'up' && us.scrollDistance > us.stickyMinDist && us.scrollTop > us.stickyMinPos) {
							us.stick(x, currentStickyHeight);
							uix.sticky.items[x].state = 3;
							needsDelayStick = true;
							currentStickyHeight += currentItem.stickyHeight;
						}
					}
				} else { // not scrollSticky
					if (currentItem.state == 1) { //Is stuck
						if ((itemFromWindowTop > wrapperFromWindowTop) || (uix.scrollTop === 0 && uix.preventAlwaysSticky)) {
							us.unstick(x);
							needsPostUnstick = true;
							newUnstickEles += ',' + currentItem.name;
							us.subElementCheck(x, currentStickyHeight, itemFromWindowTop);
						} else {
							us.subElementCheck(x, currentStickyHeight, itemFromWindowTop);
							currentStickyHeight += currentItem.stickyHeight;
						}
					} else { //Not stuck
						if ((wrapperFromWindowTopInit - currentStickyHeight <= 0) && (uix.scrollTop > 0 || !uix.preventAlwaysSticky)) {
							us.stick(x, currentStickyHeight);
							needsPostStick = true;
							newStickEles += ',' + currentItem.name;
							us.subElementCheck(x, currentStickyHeight, itemFromWindowTop);
							currentStickyHeight += currentItem.stickyHeight;
						}
					}
				}
			} else {
				if (currentItem.state == 1) {
					us.unstick(x);
				}
			}
		}
		uix.sticky.stickyHeight = currentStickyHeight;

		if (needsPostStick) {
			us.postStickFunc(newStickEles);
		}

		if (needsPostUnstick) {
			us.postUnstickFunc(newUnstickEles);
		}

		if (needsDelayUnstick) {
			uix.sidebarSticky.resize();
			us.preDelayUnstickFunc();
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					us.delayUnstick(true);
				});
			}, 210); // delay so the translate3d can happen
		} else if (needsDelayStick) {
			us.delayStick();
		}

		if (uix.smallLogo.running) {
			uix.smallLogo.checkSet();
		}
	},

	check: function() {
		var us = uix.sticky,
			pfTime = uix.time();

		us.checkGet();
		us.checkSet();

		uix.tStamp('UIX.sticky.check', 2, pfTime);
	},

	subElementCheck: function(x, currentStickyHeight, itemFromWindowTop) {
		var us = uix.sticky,
			currentItem = us.items[x];
		if (currentItem.subElement !== null && currentItem.subNormalHeight > 0 && currentItem.subStickyHide) {
			if (us.scrollDetectorRunning && currentItem.scrollSticky == 1) {
				if (currentItem.state === 1 && currentItem.subStickyHideClassAdded === false) {
					uix.sticky.items[x].subStickyHideClassAdded = true;
					currentItem.elm.addClass('uix_hideSubElement');
				} else if (currentItem.state != 1 && currentItem.subStickyHideClassAdded) {
					uix.sticky.items[x].subStickyHideClassAdded = false;
					window.setTimeout(function() {
						currentItem.elm.removeClass('uix_hideSubElement');
						us.updateNavLinks(x);
					}, 210);
				}
			} else {
				if (currentItem.state == 1) {
					if ((-1 * itemFromWindowTop) + currentStickyHeight > currentItem.subNormalHeight) {
						if (currentItem.subStickyHideClassAdded === false) {
							uix.sticky.items[x].subStickyHideClassAdded = true;
							currentItem.elm.addClass('uix_hideSubElement');
						}
					} else {
						if (currentItem.subStickyHideClassAdded) {
							uix.sticky.items[x].subStickyHideClassAdded = false;
							currentItem.elm.removeClass('uix_hideSubElement');
							us.updateNavLinks(x);
						}
					}
				} else {
					uix.sticky.items[x].subStickyHideClassAdded = false;
					currentItem.elm.removeClass('uix_hideSubElement');
					us.updateNavLinks(x);
				}
			}
		}
	},

	updateNavLinks: function(x) {
		var us = uix.sticky;

		if (us.windowWidth != us.items[x].subCheckSize) {
			uix.sticky.items[x].subCheckSize = us.windowWidth;

			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					XenForo.updateVisibleNavigationLinks();
				});
			}, 100);
		}
	},

	resize: function() {
		var us = uix.sticky;
		us.viewport();
		for (var x = 0, len = us.items.length; x < len; x++) {
			us.checkSize(x);
		}
		us.update();
	},

	viewport: function() {
		uix.sticky.windowWidth = uix.windowWidth;
		uix.sticky.windowHeight = uix.windowHeight;
		uix.sticky.landscapeOrientation = uix.landscapeOrientation;
	},

	checkSize: function(x) {
		var us = uix.sticky,
			item = us.items[x],
			windowHeight = us.windowHeight,
			windowWidth = us.windowWidth,
			landscapeOrientation = us.landscapeOrientation;

		if (landscapeOrientation) {
			if (windowHeight > item.minHeight && windowHeight <= item.maxHeight && windowWidth > item.minWidth && windowWidth <= item.maxWidth) {
				uix.sticky.items[x].enabled = true;
			} else {
				uix.sticky.items[x].enabled = false;
			}
		} else {
			if (windowHeight > item.minHeightPortrait && windowHeight <= item.maxHeightPortrait && windowWidth > item.minWidthPortrait && windowWidth <= item.maxWidthPortrait) {
				uix.sticky.items[x].enabled = true;
			} else {
				uix.sticky.items[x].enabled = false;
			}
		}
	},

	update: function() {
		var us = uix.sticky,
			items = us.items;
		currentTop = 0;
		us.check();
		for (var x = 0, len = items.length; x < len; x++) {
			var item = items[x];
			if (item.state == 1 && item.enabled) {
				innerWrapper = item.wrapper;
				if (item.scrollSticky) {
					innerWrapper.css('top', (currentTop - us.stickyOffsetDist)); // offset so items can scroll
				} else {
					innerWrapper.css({'top': currentTop});
				}
				currentTop += item.stickyHeight;
			}
		}
		us.check();
	},

	getState: function(itemName) {
		var usi = uix.sticky.items;
		for (var x = 0, len = usi.length; x < len; x++) {
			if (usi[x].name == itemName) {
				return usi[x].state;
			}
		}
		return -1;
	},

	getItemIndex: function(itemName) {
		var usi = uix.sticky.items;
		for (var x = 0, len = usi.length; x < len; x++) {
			if (usi[x].name == itemName) {
				return x;
			}
		}
		return -1;
	},

	updateScrollTop: function() {
		uix.sticky.scrollTop = window.scrollY || document.documentElement.scrollTop;
		return uix.sticky.scrollTop;
	},

	getOffset: function(desiredPos) {
		var us = uix.sticky;
		if (us.scrollDetectorRunning === false) {
			return us.fullStickyHeight + uix.globalPadding;
		}
		us.updateScrollTop();
		if (desiredPos < us.scrollTop) {
			return us.fullStickyHeight + uix.globalPadding;
		}
		return uix.globalPadding;
	},

	scrollDetectorGet: function() {
		var us = uix.sticky;

		us.updateScrollTop();

		direction = '';
		if (us.scrollDirection == 'start') {
			uix.sticky.scrollStart = us.scrollTop; // initialize
		}
		if (us.scrollTop > us.lastScrollTop) {
			if (us.scrollDirection == 'up') {
				uix.sticky.scrollStart = us.lastScrollTop; // just changing to a new direction, record the new starting point
			}
			direction = 'down';
			uix.sticky.scrollClass = 'scrollDirection-down';
		} else if (us.scrollTop < us.lastScrollTop) {
			if (us.scrollDirection == 'down') {
				uix.sticky.scrollStart = us.lastScrollTop; // just changing to a new direction, record the new starting point
			}
			direction = 'up';
			uix.sticky.scrollClass = 'scrollDirection-up';
		} else {
			direction = uix.sticky.scrollDirection;
		}
		uix.sticky.scrollDistance = Math.abs(us.scrollTop - us.scrollStart);
		uix.sticky.scrollDirection = direction;
		uix.sticky.lastScrollTop = us.scrollTop;
	},

	scrollDetectorSet: function() {
		var us = uix.sticky;

		if (us.scrollClass !== us.scrollLastClass) {
			us.html.removeClass(us.scrollLastClass).addClass(us.scrollClass);
			uix.sticky.scrollLastClass = us.scrollClass;
		}
	},

	scrollDetector: function() {
		var us = uix.sticky,
			pfTime = uix.time();

		us.scrollDetectorGet();
		us.scrollDetectorSet();

		uix.tStamp('UIX.sticky.scrollDetector', 2, pfTime);
	}
};

uix.stickyFooter = {
	running: false,
	eleTop: null,
	contentWrapper: null,
	eleTopSel: '#uix_stickyFooterSpacer',
	contentWrapperSel: '#uix_wrapper',
	state: 0,
	paddingBottom: 0,
	minDiff: uix.globalPadding,
	targetHeight: 0,
	changeMade: false,

	init: function() {
		var us = uix.stickyFooter;

		uix.stickyFooter.running = true;
		uix.stickyFooter.eleTop = $(us.eleTopSel);
		uix.stickyFooter.contentWrapper = $(us.contentWrapperSel);

		uix.stickyFooter.get();
	},

	get: function() {
		var us = uix.stickyFooter,
			changeMade = false;

		if (us.running) {
			if (us.eleTop.length > 0 && us.contentWrapper.length > 0) {
				uix.stickyFooter.paddingBottom = us.contentWrapper.offset().top;

				var windowHeight = uix.windowHeight,
					contentHeight = us.contentWrapper.height(),
					heightDiff = windowHeight - contentHeight - us.paddingBottom - us.minDiff,
					topHeight = us.eleTop.height(),
					targetHeight = (topHeight + heightDiff);

				if (targetHeight - topHeight > 0) {
					uix.stickyFooter.state = 1;
				} else if (us.state == 1) {
					uix.stickyFooter.state = 0;
				}

				if (uix.stickyFooter.targetHeight != targetHeight) {
					changeMade = true;
					uix.stickyFooter.targetHeight = targetHeight;
				}

			}
			uix.stickyFooter.changeMade = changeMade;
		}
	},

	set: function() {
		var us = uix.stickyFooter;
		if (us.changeMade) { // use changeMade later
			uix.stickyFooter.eleTop.css('min-height', (us.targetHeight + us.minDiff) + 'px');
			if (uix.enableBorderCheck && uix.initDone) {
				uix.checkRadius.check();
			}
		}
	},

	check: function() {
		var us = uix.stickyFooter;
		us.get();
		us.set();
	}
};

uix.sidebarSticky = {
	running: false,
	hasTransition: true,
	state: 0,
	bottomFixed: 0,
	hasSidebar: false,

	init: function() {
		uix.sidebarSticky.initGet();
		uix.sidebarSticky.initSet();
	},

	initGet: function() {
		uix.sidebarSticky.resizeGet();
	},

	initSet: function() {
		var us = uix.sidebarSticky,
			d = document,
			B = d.body,
			H = d.documentElement,
			elm = uix.elm.sidebar,
			inner = uix.elm.sidebarInnerWrapper;

		uix.sidebarSticky.running = true;
		us.resizeSet();
		window.setInterval(function() {
			window.requestAnimationFrame(function() {
				if (us.running && uix.initDone && uix.sidebar.visible == 1) {
					var documentHeight,
						sidebarHeight,
						sidebarEleHeight = elm[0].offsetHeight,
						wrapperHeight = inner[0].offsetHeight;

					if (typeof(document.height) !== 'undefined') {
						documentHeight = document.height; // For webkit browsers
					} else {
						documentHeight = Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight, H.scrollHeight, H.offsetHeight);
					}

					if (sidebarEleHeight > wrapperHeight) {
						sidebarHeight = sidebarEleHeight;
					} else {
						sidebarHeight = wrapperHeight;
					}

					if (documentHeight != uix.documentHeight || sidebarHeight != us.sidebarHeight) {
						uix.documentHeight = documentHeight;
						us.resize();
					}
				}
			});
		}, 200);
	},

	resize: function() {
		var us = uix.sidebarSticky,
			pfTime = uix.time();

		us.resizeGet();
		us.resizeSet();
		uix.tStamp('UIX.sidebarSticky.resize', 2, pfTime);
	},

	resizeGet: function() {
		var us = uix.sidebarSticky,
			pfTime = uix.time();
		if (uix.elm.sidebar.length && uix.stickySidebar && uix.sidebar.visible == 1) {
			if (uix.windowWidth > uix.sidebarMaxResponsiveWidth) {
				uix.sidebarSticky.running = true;
				uix.sidebarSticky.state = -1;
				uix.sidebarSticky.bottomFixed = 0;
				us.updateGet();
			}
		}
		uix.tStamp('UIX.sidebarSticky.resizeGet', 2, pfTime);
	},

	resizeSet: function() {
		var us = uix.sidebarSticky,
			pfTime = uix.time();
		if (uix.elm.sidebar.length && uix.stickySidebar && uix.sidebar.visible == 1) {
			if (uix.windowWidth > uix.sidebarMaxResponsiveWidth && us.running) {
				us.updateSet();
				if (us.state == 1) {
					uix.elm.sidebarInnerWrapper.css({
						left: us.sidebarFromLeft
					});
				} else {
					uix.elm.sidebarInnerWrapper.css('left', '');
				}
			} else if (uix.windowWidth > uix.sidebarMaxResponsiveWidth && !us.running && !uix.stickyForceDisable) {
				us.init();
			} else {
				us.reset();
			}
		}
		uix.tStamp('UIX.sidebarSticky.resizeSet', 2, pfTime);
	},

	update: function() {
		var us = uix.sidebarSticky,
			pfTime = uix.time();
		us.updateGet();
		us.updateSet();
		uix.tStamp('UIX.sidebarSticky.update', 2, pfTime);
	},

	updateGet: function() {
		var us = uix.sidebarSticky,
			elm = uix.elm.sidebar,
			inner = uix.elm.sidebarInnerWrapper;

		uix.sidebarSticky.hasSidebar = elm.length;

		if (us.hasSidebar && uix.stickySidebar && us.running) {
			var rect = elm[0].getBoundingClientRect(),
				offsetTop = rect.top + uix.scrollTop,
				offsetLeft = rect.left + uix.getScrollLeft(),
				offset = {top: offsetTop, left: offsetLeft},
				sidebarHeight = elm[0].offsetHeight,
				wrapperHeight = inner[0].offsetHeight;

			uix.sidebarSticky.sidebarOffset = offset;
			uix.sidebarSticky.sidebarFromLeft = offset.left;
			uix.sidebarSticky.mainContainerHeight = uix.elm.mainContainer[0].offsetHeight;

			if (sidebarHeight > wrapperHeight) {
				uix.sidebarSticky.sidebarHeight = sidebarHeight;
			} else {
				uix.sidebarSticky.sidebarHeight = wrapperHeight;
			}

			uix.sidebarSticky.bottomLimit = uix.elm.mainContainer.offset().top + us.mainContainerHeight - uix.sidebarStickyBottomOffset;
			uix.sidebarSticky.maxTop = us.bottomLimit - (offset.top + us.sidebarHeight);
			uix.sidebarSticky.sidebarWidth = elm[0].offsetWdith;
		}
	},

	updateSet: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && us.running) {
			us.check();

			uix.elm.sidebarInnerWrapper.css('width', us.sidebarWidth);
		}
	},

	check: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth) {
			var pfTime = uix.time();
			if (us.mainContainerHeight > us.sidebarHeight) {
				var sidebarFromWindowTop = us.sidebarOffset.top - (uix.sticky.stickyHeight + uix.scrollTop),
					bottomLimitFromWindowTop = us.bottomLimit - uix.scrollTop;

				if (us.bottomFixed != 1 && bottomLimitFromWindowTop - uix.sticky.stickyHeight <= us.sidebarHeight + uix.globalPadding) {
					us.fixBottom();
				} else if (us.state !== 0 && sidebarFromWindowTop - uix.globalPadding > 0) {
					us.unstick();
				} else if (us.state != 1 && bottomLimitFromWindowTop - uix.sticky.stickyHeight > us.sidebarHeight + uix.globalPadding && sidebarFromWindowTop - uix.globalPadding <= 0) {
					us.stick();
				}
			} else if (us.running && us.state !== 0) {
				us.unstick();
			}
			uix.tStamp('UIX.sidebarSticky.check', 2, pfTime);
		}
	},

	stick: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth && uix.sidebar.visible == 1) {
			var pfTime = uix.time();
			uix.elm.sidebar.addClass('sticky');
			uix.sidebarSticky.state = 1;
			uix.sidebarSticky.bottomFixed = 0;
			if (!uix.slidingSidebar && us.hasTransition) {
				uix.sidebarSticky.hasTransition = false;
				uix.elm.sidebarInnerWrapper.css({transition: 'top 0.0s'});
			}
			uix.elm.sidebarInnerWrapper.css({
				top: uix.sticky.stickyHeight + uix.globalPadding,
				left: us.sidebarOffset.left
			});
			uix.tStamp('UIX.sidebarSticky.stick', 2, pfTime);
		}
	},

	unstick: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && us.running) {
			var pfTime = uix.time();
			uix.elm.sidebar.removeClass('sticky');
			uix.sidebarSticky.state = 0;
			uix.sidebarSticky.bottomFixed = 0;
			if (uix.slidingSidebar && !us.hasTransition) {
				uix.sidebarSticky.hasTransition = true;
				uix.elm.sidebarInnerWrapper.css({
					transition: 'top 0.2s'
				});
			} else if (!uix.slidingSidebar && us.hasTransition) {
				uix.sidebarSticky.hasTransition = false;
				uix.elm.sidebarInnerWrapper.css({
					transition: 'top 0.0s'
				});
			}
			uix.elm.sidebarInnerWrapper.css({
				top: '',
				left: ''
			});
			uix.tStamp('UIX.sidebarSticky.unStick', 2, pfTime);
		}
	},

	fixBottom: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth) {
			var pfTime = uix.time();
			uix.stickySidebar.hasTransition = false;
			uix.elm.sidebar.removeClass('sticky');

			uix.elm.sidebarInnerWrapper.css({
				transition: 'top 0.0s',
				top: us.maxTop,
				left: ''
			});
			uix.sidebarSticky.state = 2;
			uix.sidebarSticky.bottomFixed = 1;
			uix.tStamp('UIX.sidebarSticky.fixBottom', 2, pfTime);
		}
	},

	reset: function() {
		var us = uix.sidebarSticky;

		if (us.hasSidebar && uix.stickySidebar && us.running) {
			var pfTime = uix.time();
			us.unstick();
			uix.elm.sidebarInnerWrapper.css('width', '');
			uix.sidebarSticky.running = false;
			uix.tStamp('UIX.sidebarSticky.reset', 2, pfTime);
		}
	}
};

// #######################################################################################
// #																					 #
// #								UIX Template Functions								 #
// #																					 #
// #######################################################################################

uix.templates = {
	userBar: function() {
		uix.userBar.check();
	},

	offcanvasStatic: function() {
		uix.offcanvas.updateStatic();
	}
};

// #######################################################################################
// #																					 #
// #							 Request Animation Frame Polyfill						 #
// #																					 #
// #######################################################################################

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// refactored by Yannick Albert

// MIT license
(function(window) {
	var equestAnimationFrame = 'equestAnimationFrame',
		requestAnimationFrame = 'r' + equestAnimationFrame,

		ancelAnimationFrame = 'ancelAnimationFrame',
		cancelAnimationFrame = 'c' + ancelAnimationFrame,

		expectedTime = 0,
		vendors = ['moz', 'ms', 'o', 'webkit'],
		vendor;

	while (!window[requestAnimationFrame] && (vendor = vendors.pop())) {
		window[requestAnimationFrame] = window[vendor + 'R' + equestAnimationFrame];
		window[cancelAnimationFrame] = window[vendor + 'C' + ancelAnimationFrame] || window[vendor + 'CancelR' + equestAnimationFrame];
	}

	if (!window[requestAnimationFrame]) {
		window[requestAnimationFrame] = function(callback) {
			var currentTime = new Date().getTime(),
				adjustedDelay = 16 - (currentTime - expectedTime),
				delay = adjustedDelay > 0 ? adjustedDelay : 0;

			expectedTime = currentTime + delay;

			return setTimeout(function() {
				callback(expectedTime);
			}, delay);
		};

		window[cancelAnimationFrame] = clearTimeout;
	}
}(this));

// #######################################################################################
// #																					 #
// #							 			Modernizr									 #
// #																					 #
// #######################################################################################

/*!
 * modernizr v3.0.0-alpha.3
 * Build http://v3.modernizr.com/download/#-borderradius-cssanimations-csspositionsticky-csstransforms-csstransforms3d-csstransitions-draganddrop-emoji-flexbox-flexboxlegacy-flexboxtweener-fontface-rgba-touchevents-dontmin
 *
 * Copyright (c)
 *	Faruk Ates
 *	Paul Irish
 *	Alex Sexton
 *	Ryan Seddon
 *	Alexander Farkas
 *	Patrick Kettner
 *	Stu Cox
 *	Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined) {
	var classes = [];
	var tests = [];
	var ModernizrProto = {
		// The current version, dummy
		_version: '3.0.0-alpha.3',

		// Any settings that don't work as separate modules
		// can go in here as configuration.
		_config: {
			'classPrefix' : '',
			'enableClasses' : true,
			'enableJSClass' : true,
			'usePrefixes' : true
		},

		// Queue of tests
		_q: [],

		// Stub these for people who are listening
		on: function(test, cb) {
			// I don't really think people should do this, but we can
			// safe guard it a bit.
			// -- NOTE:: this gets WAY overridden in src/addTest for
			// actual async tests. This is in case people listen to
			// synchronous tests. I would leave it out, but the code
			// to *disallow* sync tests in the real version of this
			// function is actually larger than this.
			var self = this;
			setTimeout(function() {
				cb(self[test]);
			}, 0);
		},

		addTest: function(name, fn, options) {
			tests.push({name : name, fn : fn, options : options});
		},

		addAsyncTest: function(fn) {
			tests.push({name : null, fn : fn});
		}
	};

	// Fake some of Object.create
	// so we can force non test results
	// to be non "own" properties.
	var Modernizr = function() {};
	Modernizr.prototype = ModernizrProto;

	// Leak modernizr globally when you `require` it
	// rather than force it here.
	// Overwrite name so constructor name is nicer :D
	Modernizr = new Modernizr();

	/**
	 * is returns a boolean for if typeof obj is exactly type.
	 */
	function is(obj, type) {
		return typeof obj === type;
	}

	// Run through all tests and detect their support in the current UA.
	function testRunner() {
		var featureNames;
		var feature;
		var aliasIdx;
		var result;
		var nameIdx;
		var featureName;
		var featureNameSplit;

		for (var featureIdx in tests) {
			featureNames = [];
			feature = tests[featureIdx];
			// run the test, throw the return value into the Modernizr,
			//	 then based on that boolean, define an appropriate className
			//	 and push it into an array of classes we'll join later.
			//
			//	 If there is no name, it's an 'async' test that is run,
			//	 but not directly added to the object. That should
			//	 be done with a post-run addTest call.
			if (feature.name) {
				featureNames.push(feature.name.toLowerCase());

				if (feature.options && feature.options.aliases && feature.options.aliases.length) {
					// Add all the aliases into the names list
					for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
						featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
					}
				}
			}

			// Run the test, or use the raw value if it's not a function
			result = is(feature.fn, 'function') ? feature.fn() : feature.fn;

			// Set each of the names on the Modernizr object
			for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
				featureName = featureNames[nameIdx];
				// Support dot properties as sub tests. We don't do checking to make sure
				// that the implied parent tests have been added. You must call them in
				// order (either in the test, or make the parent test a dependency).
				//
				// Cap it to TWO to make the logic simple and because who needs that kind of subtesting
				// hashtag famous last words
				featureNameSplit = featureName.split('.');

				if (featureNameSplit.length === 1) {
					Modernizr[featureNameSplit[0]] = result;
				} else {
					// cast to a Boolean, if not one already
					/* jshint -W053 */
					if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
						Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
					}

					Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
				}

				classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
			}
		}
	}

	var docElement = document.documentElement;

	// Pass in an and array of class names, e.g.:
	//	['no-webp', 'borderradius', ...]
	function setClasses(classes) {
		var className = docElement.className;
		var classPrefix = Modernizr._config.classPrefix || '';

		// Change `no-js` to `js` (we do this independently of the `enableClasses`
		// option)
		// Handle classPrefix on this too
		if (Modernizr._config.enableJSClass) {
			var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
			className = className.replace(reJS, '$1' + classPrefix + 'js$2');
		}

		if (Modernizr._config.enableClasses) {
			// Add the new classes
			className += ' ' + classPrefix + classes.join(' ' + classPrefix);
			docElement.className = className;
		}

	}

	var createElement = function() {
		if (typeof document.createElement !== 'function') {
			// This is the case in IE7, where the type of createElement is "object".
			// For this reason, we cannot call apply() as Object is not a Function.
			return document.createElement(arguments[0]);
		} else {
			return document.createElement.apply(document, arguments);
		}
	};

	/*!
	{
		"name": "CSS rgba",
		"caniuse": "css3-colors",
		"property": "rgba",
		"tags": ["css"],
		"notes": [{
			"name": "CSSTricks Tutorial",
			"href": "http://css-tricks.com/rgba-browser-support/"
		}]
	}
	!*/

	Modernizr.addTest('rgba', function() {
		var elem = createElement('div');
		var style = elem.style;
		style.cssText = 'background-color:rgba(150,255,150,.5)';

		return ('' + style.backgroundColor).indexOf('rgba') > -1;
	});

	/*!
	{
		"name": "Drag & Drop",
		"property": "draganddrop",
		"caniuse": "dragndrop",
		"knownBugs": ["Mobile browsers like Android, iOS < 6, and Firefox OS technically support the APIs, but don't expose it to the end user, resulting in a false positive."],
		"notes": [{
			"name": "W3C spec",
			"href": "http://www.w3.org/TR/2010/WD-html5-20101019/dnd.html"
		}],
		"polyfills": ["dropfile", "moxie", "fileapi"]
	}
	!*/
	/* DOC
	Detects support for native drag & drop of elements.
	*/

	Modernizr.addTest('draganddrop', function() {
		var div = createElement('div');
		return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
	});

	// List of property values to set for css tests. See ticket #21
	var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : []);

	// expose these for the plugin API. Look in the source for how to join() them against your input
	ModernizrProto._prefixes = prefixes;

	/*!
	{
		"name": "CSS position: sticky",
		"property": "csspositionsticky",
		"tags": ["css"],
		"builderAliases": ["css_positionsticky"],
		"notes": [{
			"name": "Chrome bug report",
			"href":"https://code.google.com/p/chromium/issues/detail?id=322972"
		}],
		"warnings": [ "using position:sticky on anything but top aligned elements is buggy in Chrome < 37 and iOS <=7+" ]
	}
	!*/

	// Sticky positioning - constrains an element to be positioned inside the
	// intersection of its container box, and the viewport.
	Modernizr.addTest('csspositionsticky', function() {
		var prop = 'position:';
		var value = 'sticky';
		var el = createElement('modernizr');
		var mStyle = el.style;

		mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

		return mStyle.position.indexOf(value) !== -1;
	});

	/*!
	{
		"name": "CSS Supports",
		"property": "supports",
		"caniuse": "css-featurequeries",
		"tags": ["css"],
		"builderAliases": ["css_supports"],
		"notes": [{
			"name": "W3 Spec",
			"href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
		},{
			"name": "Related Github Issue",
			"href": "github.com/Modernizr/Modernizr/issues/648"
		},{
			"name": "W3 Info",
			"href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
		}]
	}
	!*/

	var newSyntax = 'CSS' in window && 'supports' in window.CSS;
	var oldSyntax = 'supportsCSS' in window;
	Modernizr.addTest('supports', newSyntax || oldSyntax);

	/*!
	{
		"name": "Canvas",
		"property": "canvas",
		"caniuse": "canvas",
		"tags": ["canvas", "graphics"],
		"polyfills": ["flashcanvas", "excanvas", "slcanvas", "fxcanvas"]
	}
	!*/
	/* DOC
	Detects support for the `<canvas>` element for 2D drawing.
	*/

	// On the S60 and BB Storm, getContext exists, but always returns undefined
	// so we actually have to call getContext() to verify
	// github.com/Modernizr/Modernizr/issues/issue/97/
	Modernizr.addTest('canvas', function() {
		var elem = createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	});

	/*!
	{
		"name": "Canvas text",
		"property": "canvastext",
		"caniuse": "canvas-text",
		"tags": ["canvas", "graphics"],
		"polyfills": ["canvastext"]
	}
	!*/
	/* DOC
	Detects support for the text APIs for `<canvas>` elements.
	*/

	Modernizr.addTest('canvastext',	function() {
		if (Modernizr.canvas === false) {
			return false;
		}
		return typeof createElement('canvas').getContext('2d').fillText == 'function';
	});

	/*!
	{
		"name": "Emoji",
		"property": "emoji"
	}
	!*/
	/* DOC
	Detects support for emoji character sets.
	*/

	Modernizr.addTest('emoji', function() {
		if (!Modernizr.canvastext) {
			return false;
		}
		var pixelRatio = window.devicePixelRatio || 1;
		var offset = 12 * pixelRatio;
		var node = createElement('canvas');
		var ctx = node.getContext('2d');
		ctx.fillStyle = '#f00';
		ctx.textBaseline = 'top';
		ctx.font = '32px Arial';
		ctx.fillText('\ud83d\udc28', 0, 0); // U+1F428 KOALA
		return ctx.getImageData(offset, offset, 1, 1).data[0] !== 0;
	});

	function getBody() {
		// After page load injecting a fake body doesn't work so check if body exists
		var body = document.body;

		if (!body) {
			// Can't use the real body create a fake one.
			body = createElement('body');
			body.fake = true;
		}

		return body;
	}

	// Inject element with style element and some CSS rules
	function injectElementWithStyles(rule, callback, nodes, testnames) {
		var mod = 'modernizr';
		var style;
		var ret;
		var node;
		var docOverflow;
		var div = createElement('div');
		var body = getBody();

		if (parseInt(nodes, 10)) {
			// In order not to give false positives we create a node for each test
			// This also allows the method to scale for unspecified uses
			while (nodes--) {
				node = createElement('div');
				node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
				div.appendChild(node);
			}
		}

		// <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
		// when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
		// with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
		// msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
		// Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
		style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
		div.id = mod;
		// IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
		// Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
		(!body.fake ? div : body).innerHTML += style;
		body.appendChild(div);
		if (body.fake) {
			//avoid crashing IE8, if background image is used
			body.style.background = '';
			//Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
			body.style.overflow = 'hidden';
			docOverflow = docElement.style.overflow;
			docElement.style.overflow = 'hidden';
			docElement.appendChild(body);
		}

		ret = callback(div, rule);
		// If this is done after page load we don't want to remove the body so check if body exists
		if (body.fake) {
			body.parentNode.removeChild(body);
			docElement.style.overflow = docOverflow;
			// Trigger layout so kinetic scrolling isn't disabled in iOS6+
			var temp = docElement.offsetHeight;
		} else {
			div.parentNode.removeChild(div);
		}

		return !!ret;

	}

	var testStyles = ModernizrProto.testStyles = injectElementWithStyles;

	/*!
	{
		"name": "@font-face",
		"property": "fontface",
		"authors": ["Diego Perini", "Mat Marquis"],
		"tags": ["css"],
		"knownBugs": [
			"False Positive: WebOS http://github.com/Modernizr/Modernizr/issues/342",
			"False Postive: WP7 http://github.com/Modernizr/Modernizr/issues/538"
		],
		"notes": [{
			"name": "@font-face detection routine by Diego Perini",
			"href": "http://javascript.nwbox.com/CSSSupport/"
		},{
			"name": "Filament Group @font-face compatibility research",
			"href": "https://docs.google.com/presentation/d/1n4NyG4uPRjAA8zn_pSQ_Ket0RhcWC6QlZ6LMjKeECo0/edit#slide=id.p"
		},{
			"name": "Filament Grunticon/@font-face device testing results",
			"href": "https://docs.google.com/spreadsheet/ccc?key=0Ag5_yGvxpINRdHFYeUJPNnZMWUZKR2ItMEpRTXZPdUE#gid=0"
		},{
			"name": "CSS fonts on Android",
			"href": "http://stackoverflow.com/questions/3200069/css-fonts-on-android"
		},{
			"name": "@font-face and Android",
			"href": "http://archivist.incutio.com/viewlist/css-discuss/115960"
		}]
	}
	!*/

	var blacklist = (function() {
		var ua = navigator.userAgent;
		var wkvers = ua.match(/applewebkit\/([0-9]+)/gi) && parseFloat(RegExp.$1);
		var webos = ua.match(/w(eb)?osbrowser/gi);
		var wppre8 = ua.match(/windows phone/gi) && ua.match(/iemobile\/([0-9])+/gi) && parseFloat(RegExp.$1) >= 9;
		var oldandroid = wkvers < 533 && ua.match(/android/gi);
		return webos || oldandroid || wppre8;
	}());
	if (blacklist) {
		Modernizr.addTest('fontface', false);
	} else {
		testStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
			var style = document.getElementById('smodernizr');
			var sheet = style.sheet || style.styleSheet;
			var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
			var bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
			Modernizr.addTest('fontface', bool);
		});
	}

	/*!
	{
		"name": "Touch Events",
		"property": "touchevents",
		"caniuse" : "touch",
		"tags": ["media", "attribute"],
		"notes": [{
			"name": "Touch Events spec",
			"href": "http://www.w3.org/TR/2013/WD-touch-events-20130124/"
		}],
		"warnings": [
			"Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
		],
		"knownBugs": [
			"False-positive on some configurations of Nokia N900",
			"False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
		]
	}
	!*/
	/* DOC
	Indicates if the browser supports the W3C Touch Events API.

	This *does not* necessarily reflect a touchscreen device:

	* Older touchscreen devices only emulate mouse events
	* Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
	* Some browsers & OS setups may enable touch APIs when no touchscreen is connected
	* Future browsers may implement other event models for touch interactions

	See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

	It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).

	This test will also return `true` for Firefox 4 Multitouch support.
	*/

	// Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
	Modernizr.addTest('touchevents', function() {
		var bool;
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			bool = true;
		} else {
			var query = ['@media (',prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
			testStyles(query, function(node) {
				bool = node.offsetTop === 9;
			});
		}
		return bool;
	});

	// Following spec is to expose vendor-specific style properties as:
	//	 elem.style.WebkitBorderRadius
	// and the following would be incorrect:
	//	 elem.style.webkitBorderRadius

	// Webkit ghosts their properties in lowercase but Opera & Moz do not.
	// Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
	//	 erik.eae.net/archives/2008/03/10/21.48.10/

	// More here: github.com/Modernizr/Modernizr/issues/issue/21
	var omPrefixes = 'Moz O ms Webkit';

	var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
	ModernizrProto._cssomPrefixes = cssomPrefixes;

	var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
	ModernizrProto._domPrefixes = domPrefixes;

	/**
	 * contains returns a boolean for if substr is found within str.
	 */
	function contains(str, substr) {
		return !!~('' + str).indexOf(substr);
	}

	// Helper function for converting kebab-case to camelCase,
	// e.g. box-sizing -> boxSizing
	function cssToDOM(name) {
		return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
			return m1 + m2.toUpperCase();
		}).replace(/^-/, '');
	}

	// Change the function's scope.
	function fnBind(fn, that) {
		return function() {
			return fn.apply(that, arguments);
		};
	}

	/**
	 * testDOMProps is a generic DOM property test; if a browser supports
	 *	 a certain property, it won't return undefined for it.
	 */
	function testDOMProps(props, obj, elem) {
		var item;

		for (var i in props) {
			if (props[i] in obj) {

				// return the property name as a string
				if (elem === false) {
					return props[i];
				}

				item = obj[props[i]];

				// let's bind a function
				if (is(item, 'function')) {
					// bind to obj unless overriden
					return fnBind(item, elem || obj);
				}

				// return the unbound function or obj or value
				return item;
			}
		}
		return false;
	}

	/**
	 * Create our "modernizr" element that we do most feature tests on.
	 */
	var modElem = {
		elem : createElement('modernizr')
	};

	// Clean up this element
	Modernizr._q.push(function() {
		delete modElem.elem;
	});

	var mStyle = {
		style : modElem.elem.style
	};

	// kill ref for gc, must happen before
	// mod.elem is removed, so we unshift on to
	// the front of the queue.
	Modernizr._q.unshift(function() {
		delete mStyle.style;
	});

	// Helper function for converting camelCase to kebab-case,
	// e.g. boxSizing -> box-sizing
	function domToCSS(name) {
		return name.replace(/([A-Z])/g, function(str, m1) {
			return '-' + m1.toLowerCase();
		}).replace(/^ms-/, '-ms-');
	}

	// Function to allow us to use native feature detection functionality if available.
	// Accepts a list of property names and a single value
	// Returns `undefined` if native detection not available
	function nativeTestProps (props, value) {
		var i = props.length;
		// Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
		if ('CSS' in window && 'supports' in window.CSS) {
			// Try every prefixed variant of the property
			while (i--) {
				if (window.CSS.supports(domToCSS(props[i]), value)) {
					return true;
				}
			}
			return false;
		} else if ('CSSSupportsRule' in window) {
			// Otherwise fall back to at-rule (for Opera 12.x)
			// Build a condition string for every prefixed variant
			var conditionText = [];
			while (i--) {
				conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
			}
			conditionText = conditionText.join(' or ');
			return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
				return getComputedStyle(node, null).position == 'absolute';
			});
		}
		return undefined;
	}

	// testProps is a generic CSS / DOM property test.

	// In testing support for a given CSS property, it's legit to test:
	//		`elem.style[styleName] !== undefined`
	// If the property is supported it will return an empty string,
	// if unsupported it will return undefined.

	// We'll take advantage of this quick test and skip setting a style
	// on our modernizr element, but instead just testing undefined vs
	// empty string.

	// Property names can be provided in either camelCase or kebab-case.

	function testProps(props, prefixed, value, skipValueTest) {
		skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

		// Try native detect first
		if (!is(value, 'undefined')) {
			var result = nativeTestProps(props, value);
			if (!is(result, 'undefined')) {
				return result;
			}
		}

		// Otherwise do it properly
		var afterInit, i, propsLength, prop, before;

		// If we don't have a style element, that means
		// we're running async or after the core tests,
		// so we'll need to create our own elements to use
		if (!mStyle.style) {
			afterInit = true;
			mStyle.modElem = createElement('modernizr');
			mStyle.style = mStyle.modElem.style;
		}

		// Delete the objects if we
		// we created them.
		function cleanElems() {
			if (afterInit) {
				delete mStyle.style;
				delete mStyle.modElem;
			}
		}

		propsLength = props.length;
		for (i = 0; i < propsLength; i++) {
			prop = props[i];
			before = mStyle.style[prop];

			if (contains(prop, '-')) {
				prop = cssToDOM(prop);
			}

			if (mStyle.style[prop] !== undefined) {

				// If value to test has been passed in, do a set-and-check test.
				// 0 (integer) is a valid property value, so check that `value` isn't
				// undefined, rather than just checking it's truthy.
				if (!skipValueTest && !is(value, 'undefined')) {

					// Needs a try catch block because of old IE. This is slow, but will
					// be avoided in most cases because `skipValueTest` will be used.
					try {
						mStyle.style[prop] = value;
					} catch (e) {}

					// If the property value has changed, we assume the value used is
					// supported. If `value` is empty string, it'll fail here (because
					// it hasn't changed), which matches how browsers have implemented
					// CSS.supports()
					if (mStyle.style[prop] != before) {
						cleanElems();
						return prefixed == 'pfx' ? prop : true;
					}
				} else {
					// Otherwise just return true, or the property name if this is a
					// `prefixed()` call
					cleanElems();
					return prefixed == 'pfx' ? prop : true;
				}
			}
		}
		cleanElems();
		return false;
	}

	/**
	 * testPropsAll tests a list of DOM properties we want to check against.
	 *		 We specify literally ALL possible (known and/or likely) properties on
	 *		 the element including the non-vendor prefixed one, for forward-
	 *		 compatibility.
	 */
	function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

		var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
		props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

		// did they call .prefixed('boxSizing') or are we just testing a prop?
		if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
			return testProps(props, prefixed, value, skipValueTest);

			// otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
		} else {
			props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
			return testDOMProps(props, prefixed, elem);
		}
	}

	// Modernizr.testAllProps() investigates whether a given style property,
	//		 or any of its vendor-prefixed variants, is recognized
	// Note that the property names must be provided in the camelCase variant.
	// Modernizr.testAllProps('boxSizing')
	ModernizrProto.testAllProps = testPropsAll;

	/**
	 * testAllProps determines whether a given CSS property, in some prefixed
	 * form, is supported by the browser. It can optionally be given a value; in
	 * which case testAllProps will only return true if the browser supports that
	 * value for the named property; this latter case will use native detection
	 * (via window.CSS.supports) if available. A boolean can be passed as a 3rd
	 * parameter to skip the value check when native detection isn't available,
	 * to improve performance when simply testing for support of a property.
	 *
	 * @param prop - String naming the property to test (either camelCase or
	 *							 kebab-case)
	 * @param value - [optional] String of the value to test
	 * @param skipValueTest - [optional] Whether to skip testing that the value
	 *												is supported when using non-native detection
	 *												(default: false)
	 */
	function testAllProps (prop, value, skipValueTest) {
		return testPropsAll(prop, undefined, undefined, value, skipValueTest);
	}
	ModernizrProto.testAllProps = testAllProps;

	/*!
	{
		"name": "Border Radius",
		"property": "borderradius",
		"caniuse": "border-radius",
		"polyfills": ["css3pie"],
		"tags": ["css"],
		"notes": [{
			"name": "Comprehensive Compat Chart",
			"href": "http://muddledramblings.com/table-of-css3-border-radius-compliance"
		}]
	}
	!*/

	Modernizr.addTest('borderradius', testAllProps('borderRadius', '0px', true));

	/*!
	{
		"name": "CSS Animations",
		"property": "cssanimations",
		"caniuse": "css-animation",
		"polyfills": ["transformie", "csssandpaper"],
		"tags": ["css"],
		"warnings": ["Android < 4 will pass this test, but can only animate a single property at a time"],
		"notes": [{
			"name" : "Article: 'Dispelling the Android CSS animation myths'",
			"href": "http://goo.gl/OGw5Gm"
		}]
	}
	!*/
	/* DOC
	Detects whether or not elements can be animated using CSS
	*/

	Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

	/*!
	{
		"name": "CSS Transforms",
		"property": "csstransforms",
		"caniuse": "transforms2d",
		"tags": ["css"]
	}
	!*/

	Modernizr.addTest('csstransforms', function() {
		// Android < 3.0 is buggy, so we sniff and blacklist
		// http://git.io/hHzL7w
		return navigator.userAgent.indexOf('Android 2.') === -1 && testAllProps('transform', 'scale(1)', true);
	});

	/*!
	{
		"name": "CSS Transforms 3D",
		"property": "csstransforms3d",
		"caniuse": "transforms3d",
		"tags": ["css"],
		"warnings": [
			"Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
		]
	}
	!*/

	Modernizr.addTest('csstransforms3d', function() {
		var ret = !!testAllProps('perspective', '1px', true);
		var usePrefix = Modernizr._config.usePrefixes;

		// Webkit's 3D transforms are passed off to the browser's own graphics renderer.
		//	 It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
		//	 some conditions. As a result, Webkit typically recognizes the syntax but
		//	 will sometimes throw a false positive, thus we must do a more thorough check:
		if (ret && (!usePrefix || 'webkitPerspective' in docElement.style)) {
			var mq;
			// Use CSS Conditional Rules if available
			if (Modernizr.supports) {
				mq = '@supports (perspective: 1px)';
			} else {
				// Otherwise, Webkit allows this media query to succeed only if the feature is enabled.
				// `@media (transform-3d),(-webkit-transform-3d){ ... }`
				mq = '@media (transform-3d)';
				if (usePrefix) {
					mq += ',(-webkit-transform-3d)';
				}
			}
			// If loaded inside the body tag and the test element inherits any padding, margin or borders it will fail #740
			mq += '{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}';

			testStyles(mq, function(elem) {
				ret = elem.offsetLeft === 9 && elem.offsetHeight === 5;
			});
		}

		return ret;
	});

	/*!
	{
		"name": "CSS Transitions",
		"property": "csstransitions",
		"caniuse": "css-transitions",
		"tags": ["css"]
	}
	!*/

	Modernizr.addTest('csstransitions', testAllProps('transition', 'all', true));

	/*!
	{
		"name": "Flexbox",
		"property": "flexbox",
		"caniuse": "flexbox",
		"tags": ["css"],
		"notes": [{
			"name": "The _new_ flexbox",
			"href": "http://dev.w3.org/csswg/css3-flexbox"
		}],
		"warnings": [
			"A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
		]
	}
	!*/
	/* DOC
	Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
	*/

	Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

	/*!
	{
		"name": "Flexbox (legacy)",
		"property": "flexboxlegacy",
		"tags": ["css"],
		"polyfills": ["flexie"],
		"notes": [{
			"name": "The _old_ flexbox",
			"href": "http://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
		}]
	}
	!*/

	Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection', 'reverse', true));

	/*!
	{
		"name": "Flexbox (tweener)",
		"property": "flexboxtweener",
		"tags": ["css"],
		"polyfills": ["flexie"],
		"notes": [{
			"name": "The _inbetween_ flexbox",
			"href": "http://www.w3.org/TR/2011/WD-css3-flexbox-20111129/"
		}],
		"warnings": ["This represents an old syntax, not the latest standard syntax."]
	}
	!*/

	Modernizr.addTest('flexboxtweener', testAllProps('flexAlign', 'end', true));

	// Run each test
	testRunner();

	// Remove the "no-js" class if it exists
	setClasses(classes);

	delete ModernizrProto.addTest;
	delete ModernizrProto.addAsyncTest;

	// Run the things that are supposed to run after the tests
	for (var i = 0; i < Modernizr._q.length; i++) {
		Modernizr._q[i]();
	}

	// Leak Modernizr namespace
	window.Modernizr = Modernizr;

})(window, document);

// #######################################################################################
// #																					 #
// #							 UIX Unordered List Functions							 #
// #																					 #
// #######################################################################################

uix.ulManager = {
	needsInit: true,
	items: [],
	leftClass: 'uix_leftMost',
	rightClass: 'uix_rightMost',

	init: function() {
		var parents = [document.getElementById('navigation'), document.getElementById('userBar')];

		for (var i = 0, len1 = parents.length; i < len1; i++) {
			if (uix.isSet(parents[i]) && parents[i] !== null) {
				var uls = parents[i].getElementsByTagName('ul');
				for (var j = 0, len2 = uls.length; j < len2; j++) {
					if (uix.isSet(uls[j])) {
						var className = uls[j].className;
						if (className.indexOf('navLeft') > -1 || className.indexOf('navRight') > -1) {
							var children = [];
							var childSel = uls[j].children;

							for (var k = 0, len3 = childSel.length; k < len3; k++) {
								if (childSel[k].tagName == 'LI') {
									children.push(childSel[k]);
								}
							}

							uix.ulManager.items.push({
								ele: uls[j],
								children: children,
								first: -1,
								firstOld: -1,
								last: -1,
								lastOld: -1
							});
						}
					}
				}
			}
		}

		uix.ulManager.needsInit = false;
	},

	checkGet: function() {
		if (uix.ulManager.needsInit) {
			uix.ulManager.init();
		}

		for (var i = 0, len1 = uix.ulManager.items.length; i < len1; i++) {
			var item = uix.ulManager.items[i],
				j,
				len2;
			for (j = 0, len2 = item.children.length; j < len2; j++) {
				if (window.getComputedStyle(item.children[j]).display.indexOf('none') === -1) {
					uix.ulManager.items[i].firstOld = uix.ulManager.items[i].first;
					uix.ulManager.items[i].first = j;
					break;
				}
			}

			for (j = item.children.length - 1; j >= 0; j--) {
				if (window.getComputedStyle(item.children[j]).display.indexOf('none') === -1) {
					uix.ulManager.items[i].lastOld = uix.ulManager.items[i].last;
					uix.ulManager.items[i].last = j;
					break;
				}
			}
		}
	},

	checkSet: function() {
		for (var i = 0, len1 = uix.ulManager.items.length; i < len1; i++) {
			if (uix.ulManager.items[i].first != uix.ulManager.items[i].firstOld) {
				if (uix.isSet(uix.ulManager.items[i].children[uix.ulManager.items[i].firstOld])) {
					uix.ulManager.items[i].children[uix.ulManager.items[i].firstOld].className = uix.ulManager.items[i].children[uix.ulManager.items[i].firstOld].className.replace(' ' + uix.ulManager.leftClass, '');
				}
				if (uix.isSet(uix.ulManager.items[i].children[uix.ulManager.items[i].first])) {
					uix.ulManager.items[i].children[uix.ulManager.items[i].first].className += ' ' + uix.ulManager.leftClass;
				}
			}

			if (uix.ulManager.items[i].last != uix.ulManager.items[i].lastOld) {
				if (uix.isSet(uix.ulManager.items[i].children[uix.ulManager.items[i].lastOld])) {
					uix.ulManager.items[i].children[uix.ulManager.items[i].lastOld].className = uix.ulManager.items[i].children[uix.ulManager.items[i].lastOld].className.replace(' ' + uix.ulManager.rightClass, '');
				}
				if (uix.isSet(uix.ulManager.items[i].children[uix.ulManager.items[i].last])) {
					uix.ulManager.items[i].children[uix.ulManager.items[i].last].className += ' ' + uix.ulManager.rightClass;
				}
			}
		}
	},

	check: function() {
		uix.ulManager.checkGet();
		uix.ulManager.checkSet();
	}
};

// #######################################################################################
// #																					 #
// #								 UIX Userbar Functions								 #
// #																					 #
// #######################################################################################

uix.userBar = {
	state: 0,
	enableHidingSmall: true, // hide userbar at small sizes (visitor tabs moved)
	enableHidingLargeLeft: true, // hide userbar at large sizes (left trigger not visible)
	enableHidingLargeRight: true, // hide userbar at large sizes (right trigger not visible)
	needsInit: true,
	ele: null,
	userbarSet: false,

	init: function() {
		uix.userBar.ele = $('#userBar');
		if (uix.userBar.ele.length) {
			var i,
				len,
				className;
			if (uix.offCanvasSidebarVisitorTabs) {
				if ($('.moderatorTabs', uix.userBar.ele).length) {
					uix.userBar.enableHidingSmall = false;
				} else if ($('#QuickSearch', uix.userBar.ele).length) {
					uix.userBar.enableHidingSmall = false;
				} else {
					var visitorTabs = $('.navRight > li', uix.userBar.ele);
					for (i = 0, len = visitorTabs.length; i < len; i++) {
						className = visitorTabs[i].className;
						if ((className.indexOf('account') == -1 && className.indexOf('inbox') == -1 && className.indexOf('alert') == -1) || className.indexOf('navTab--panelTrigger') > -1) {
							uix.userBar.enableHidingSmall = false;
						}
					}

					visitorTabs = $('.navLeft > li', uix.userBar.ele);
					for (i = 0, len = visitorTabs.length; i < len; i++) {
						className = visitorTabs[i].className;
						if ((className.indexOf('account') == -1 && className.indexOf('inbox') == -1 && className.indexOf('alert') == -1) || className.indexOf('navTab--panelTrigger') > -1) {
							uix.userBar.enableHidingSmall = false;
						}
					}
				}
			} else {
				uix.userBar.enableHidingSmall = false;
			}

			var navTabs = $('.navRight > li', uix.userBar.ele);
			if (navTabs.length) {
				for (i = 0, len = navTabs.length; i < len; i++) {
					className = navTabs[i].className;
					if (className.indexOf('navTab--panelTrigger') == -1) {
						uix.userBar.enableHidingLargeRight = false;
					}
				}
			} else {
				uix.userBar.enableHidingLargeRight = false;
			}

			navTabs = $('.navLeft > li', uix.userBar.ele);
			if (navTabs.length) {
				for (i = 0, len = navTabs.length; i < len; i++) {
					className = navTabs[i].className;
					if (className.indexOf('navTab--panelTrigger') == -1) {
						uix.userBar.enableHidingLargeLeft = false;
					}
				}
			} else {
				uix.userBar.enableHidingLargeLeft = false;
			}
		} else {
			uix.userBar.enableHidingSmall = false;
			uix.userBar.enableHidingLargeLeft = false;
			uix.userBar.enableHidingLargeRight = false;
		}

		uix.userBar.needsInit = false;
	},

	check: function() {
		uix.userBar.checkGet();
		uix.userBar.checkSet();
	},

	checkGet: function() {
		if (uix.userBar.needsInit) {
			uix.userBar.init();
		}

		if (!uix.userBar.userbarSet) {
			var changeMade = false;

			for (var i = 0, len = uix.sticky.items.length; i < len; i++) {
				if (uix.sticky.items[i].name === '#userBar') {
					if (uix.userBar.enableHidingLargeLeft && uix.userBar.enableHidingLargeRight) {
						var largerBreakpoint = uix.offCanvasLeftTriggerWidth;
						if (uix.offCanvasRightTriggerWidth > largerBreakpoint) {
							largerBreakpoint = uix.offCanvasRightTriggerWidth;
						}
						if (uix.sticky.items[i].maxWidth > largerBreakpoint) {
							uix.sticky.items[i].maxWidth = largerBreakpoint;
							changeMade = true;
						}
						if (uix.sticky.items[i].maxWidthPortrait > largerBreakpoint) {
							uix.sticky.items[i].maxWidthPortrait = largerBreakpoint;
							changeMade = true;
						}
					}

					if (uix.userBar.enableHidingSmall) {
						if (uix.sticky.items[i].minWidth < uix.offCanvasVisitorTriggerWidth) {
							uix.sticky.items[i].minWidth = uix.offCanvasVisitorTriggerWidth;
							changeMade = true;
						}
						if (uix.sticky.items[i].minWidthPortrait < uix.offCanvasVisitorTriggerWidth) {
							uix.sticky.items[i].minWidthPortrait = uix.offCanvasVisitorTriggerWidth;
							changeMade = true;
						}
					}
				}
			}

			if (changeMade) {
				uix.userBar.userbarSet = true;
				if (uix.sticky.running) {
					uix.sticky.resize();
				}
			}
		}
	},

	checkSet: function() {
		if (uix.userBar.ele.length) {
			var largerBreakpoint;

			if (!uix.isSet(uix.windowWidth)) {
				uix.viewport.init();
			}

			if (uix.userBar.enableHidingSmall && (uix.userBar.enableHidingLargeLeft && uix.userBar.enableHidingLargeRight)) {
				if (uix.userBar.enableHidingLargeLeft && uix.userBar.enableHidingLargeRight) {
					largerBreakpoint = uix.offCanvasLeftTriggerWidth;
					if (uix.windowWidth > largerBreakpoint && uix.windowWidth <= uix.offCanvasVisitorTriggerWidth) {
						if (uix.userBar.state == 1) {
							uix.userBar.ele.css({'display': ''});
							uix.userBar.state = 0;
						}
					} else {
						if (uix.userBar.state === 0) {
							uix.userBar.ele.css({'display': 'block'});
							uix.userBar.state = 1;
						}
					}
				}
			} else if (uix.userBar.enableHidingLargeLeft && uix.userBar.enableHidingLargeRight) {
				if (uix.userBar.enableHidingLargeLeft && uix.userBar.enableHidingLargeRight) {
					largerBreakpoint = uix.offCanvasLeftTriggerWidth;
					if (uix.windowWidth > largerBreakpoint) {
						if (uix.userBar.state == 1) {
							uix.userBar.ele.css({'display': ''});
							uix.userBar.state = 0;
						}
					} else {
						if (uix.userBar.state === 0) {
							uix.userBar.ele.css({'display': 'block'});
							uix.userBar.state = 1;
						}
					}
				}
			} else if (uix.userBar.enableHidingSmall) {
				if (uix.windowWidth <= uix.offCanvasVisitorTriggerWidth) {
					if (uix.userBar.state == 1) {
						uix.userBar.ele.css({'display': ''});
						uix.userBar.state = 0;
					}
				} else {
					if (uix.userBar.state === 0) {
						uix.userBar.ele.css({'display': 'block'});
						uix.userBar.state = 1;
					}
				}
			} else {
				if (uix.userBar.state === 0) {
					uix.userBar.ele.css({'display': 'block'});
					uix.userBar.state = 1;
				}
			}
		}
	}
};

// #######################################################################################
// #																					 #
// #									UIX Viewport									 #
// #																					 #
// #######################################################################################

uix.viewport = {
	running: false,
	scrollClass: '',

	get: function() {
		uix.scrollTop = window.scrollY || document.documentElement.scrollTop;

		if (uix.windowWidth < uix.windowHeight) {
			uix.landscapeOrientation = false;
		} else {
			uix.landscapeOrientation = true;
		}
	},

	set: function() {
		if (uix.scrollTop === 0) {
			uix.elm.html.removeClass('scrollNotTouchingTop');
			uix.viewport.scrollClass = '';
		} else if (uix.viewport.scrollClass != 'scrollNotTouchingTop') {
			uix.elm.html.addClass('scrollNotTouchingTop');
			uix.viewport.scrollClass = 'scrollNotTouchingTop';
		}
	},

	check: function() {
		var pfTime = uix.time();
		uix.viewport.get();
		uix.viewport.set();
		uix.tStamp('UIX.viewport.check', 2, pfTime);
	},

	init: function() {
		var pfTime = uix.time();
		var e = window,
			a = 'inner';
		if (!window.innerWidth) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		var viewport = {
			width: e[a + 'Width'],
			height: e[a + 'Height']
		};
		uix.windowWidth = viewport.width;
		uix.windowHeight = viewport.height;

		if (uix.viewport.running === false) {
			uix.viewport.running = true; // don't add the on scroll multiple times
		}

		uix.viewport.get();

		uix.tStamp('UIX.viewport.init', 1, pfTime);
	}
};

// #######################################################################################
// #																					 #
// #							 UIX Width Toggle Functions								 #
// #																					 #
// #######################################################################################

uix.toggleWidth = {
	needsInit: true,
	enabled: false,
	state: 0,
	widthSet: false,
	running: false,
	width: -1,
	target: [],
	trigger: [],
	triggerWidth: 1170,
	triggerVisible: true,

	setup: function() {
		uix.toggleWidth.state = uix.user.widthToggleState;
		uix.toggleWidth.running = true;
		uix.toggleWidth.triggerWidth = uix.toggleWidthBreakpoint;
	},

	initGet: function() {
		uix.toggleWidth.setup();
		uix.toggleWidth.needsInit = false;
		uix.toggleWidth.target = document.querySelectorAll('.mainPanelWrapper');
		uix.toggleWidth.trigger = document.querySelectorAll('.chooser_widthToggle');
		if (uix.toggleWidth.target.length == 1 && uix.toggleWidth.trigger.length == 1) {
			uix.toggleWidth.enabled = true;
		}
		uix.toggleWidth.resizeGet();
	},

	initSet: function() {
		uix.toggleWidth.resizeSet();
	},

	init: function() {
		uix.toggleWidth.initGet();
		uix.toggleWidth.initSet();
	},

	resizeGet: function() {
		if (uix.toggleWidth.enabled) {
			uix.toggleWidth.width = uix.toggleWidth.target[0].offsetWidth;
		}
	},

	resizeSet: function() {
		if (uix.toggleWidth.enabled) {
			var newWidth = uix.toggleWidth.width;
			if (newWidth < uix.toggleWidth.triggerWidth) {
				if (uix.toggleWidth.triggerVisible) {
					uix.toggleWidth.triggerVisible = false;
					uix.toggleWidth.setTriggerState(false);

				}
			} else {
				if (!uix.toggleWidth.triggerVisible) {
					uix.toggleWidth.triggerVisible = true;
					uix.toggleWidth.setTriggerState(true);
				}
			}
		}
	},

	resize: function() {
		uix.toggleWidth.resizeGet();
		uix.toggleWidth.resizeSet();
	},

	setTriggerState: function(state) {
		if (uix.toggleWidth.enabled) {
			if (state) {
				uix.toggleWidth.trigger[0].style.display = '';
			} else {
				uix.toggleWidth.trigger[0].style.display = 'none';
			}
		}
	},

	setIcon: function(state) {
		if (state == 1) {
			$('.js-widthIcon').addClass('uix_icon-compressWidth').removeClass('uix_icon-expandWidth');
		} else {
			$('.js-widthIcon').removeClass('uix_icon-compressWidth').addClass('uix_icon-expandWidth');
		}
	},

	toggle: function() {
		if (uix.toggleWidth.needsInit) {
			uix.toggleWidth.init();
		}

		if (uix.toggleWidth.state === 0) {
			$('html').addClass('is-fullWidth').removeClass('is-setWidth');
			uix.toggleWidth.state = 1;
			uix.toggleWidth.setIcon(1);
		} else {
			$('html').removeClass('is-fullWidth').addClass('is-setWidth');
			uix.toggleWidth.state = 0;
			uix.toggleWidth.setIcon(0);
		}

		//trigger resize after animation
		window.setTimeout(function() {
			uix.resizeFire();
		}, 400);

		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					content = xmlhttp.responseText;
				}
			}
		};

		xmlhttp.open('GET', uix.ajaxWidthToggleLink, true);
		xmlhttp.send();
	}
};

// #######################################################################################
// #																					 #
// #						 Xenforo Jump to Quoted Post								 #
// #																					 #
// #######################################################################################
// Override default xenforo function to add in sticky height offset.
XenForo.AttributionLink = function($link) {
	$link.click(function(e) {
		if ($(this.hash).length) {
			try {
				var hash = this.hash,
					top = $(this.hash).offset().top - uix.sticky.getOffset($(this.hash).offset().top), // modified line
					scroller = XenForo.getPageScrollTagName();

				if ('pushState' in window.history) {
					window.history.pushState({}, '', window.location.toString().replace(/#.*$/, '') + hash);
				}

				$(scroller).animate({
					scrollTop: top
				}, XenForo.speed.normal, 'swing', function() {
					if (!window.history.pushState) {
						window.location.hash = hash;
					}
				});
			} catch (val) {
				window.location.hash = this.hash;
			}

			e.preventDefault();
		}
	});
};

// #######################################################################################
// #																					 #
// #									Xenforo Reply									 #
// #																					 #
// #######################################################################################
// Override default xenforo function to add sticky height offset.
$(document).ready(function() {
	$('a.ReplyQuote, a.QuoteSelected').click(function() {
		$(document).scrollTop($('#QuickReply').offset().top - uix.sticky.getOffset($('#QuickReply').offset().top)); // modified line
	});
});

// #######################################################################################
// #																					 #
// #								XenForo's Popup Menu Click							 #
// #																					 #
// #######################################################################################
// Override xenforo's default menu click handler to improve behavior with desktop quick clicks and mobile

XenForo.PopupMenu.prototype.__construct = function($container) {

	// the container holds the control and the menu
	this.$container = $container;

	if ($container.parent().closest('.Menu').length === 0) {
		// take the menu, which will be a sibling of the control, and append/move it to the end of the body
		this.$menu = this.$container.find('.Menu:first').appendTo('body');

		this.$menu.data('XenForo.PopupMenu', this);
		this.menuVisible = false;

		// check that we have the necessary elements
		if (!this.$menu.length) {
			console.warn('Unable to find menu for Popup %o', this.$container);

			return false;
		}

		// add a unique id to the menu
		this.$menu.id = XenForo.uniqueId(this.$menu);

		// variables related to dynamic content loading
		this.contentSrc = this.$menu.data('contentsrc');
		this.contentDest = this.$menu.data('contentdest');
		this.loading = null;
		this.unreadDisplayTimeout = null;
		this.newlyOpened = false;

		var clickerFound = false,
			i,
			len;

		// bind events to the menu control
		var eles = $container.find('[rel=\"Menu\"]');
		for (i = 0, len = eles.length; i < len; i++) {
			if (i === 0) {
				this.$clicker = $(eles[i]).click($.context(this, 'controlClick'));
				clickerFound = true;
			}
		}

		var navLinks = $container.find('.navLink');
		for (i = 0, len = navLinks.length; i < len; i++) {
			var navLink = $(navLinks[i]);
			if (eles.length && navLink !== eles[0]) {
				navLink.click($.context(this, 'controlClick'));
				if (!XenForo.isTouchBrowser() && navLink.length) {
					navLink.mouseover($.context(this, 'controlHover')).hoverIntent(
					{
						sensitivity: 1,
						interval: 100,
						timeout: 0,
						over: $.context(this, 'controlHoverIntent'),
						out: function() {}
					});
				}
			}
		}

		if (clickerFound) {
			if (!XenForo.isTouchBrowser() && this.$clicker.length) {
				this.$clicker.mouseover($.context(this, 'controlHover')).hoverIntent(
				{
					sensitivity: 1,
					interval: 100,
					timeout: 0,
					over: $.context(this, 'controlHoverIntent'),
					out: function() {}
				});
			}

			this.$control = this.addPopupGadget(this.$clicker);

			// the popup group for this menu, if specified
			this.popupGroup = this.$control.closest('[data-popupgroup]').data('popupgroup');
		}

		//console.log('Finished popup menu for %o', this.$control);
	}
};

XenForo.PopupMenu.prototype.controlClick = function(e) {
	console.debug('%o control clicked. NewlyOpened: %s, Animated: %s', this.$control, this.newlyOpened, this.$menu.is(':animated'));
	if (true || (!this.newlyOpened && !this.$menu.is(':animated'))) {
		console.info('control: %o', this.$control);

		if (XenForo.isTouchBrowser()) {// mobile retains default behavior -- KC
			if (this.$menu.is(':hidden')) {
				this.showMenu(e, false);
			} else if (this.$clicker.attr('href') && !XenForo.isPositive(this.$clicker.data('closemenu'))) {
				console.warn('Following hyperlink from %o', this.$clicker);
				return true;
			}
		} else if (this.$menu.is(':hidden') && this.$clicker.hasClass('uix_dropdownDesktopMenu')) {// open menu first -- KC
			if (!this.newlyOpened) {
				this.showMenu(e, false);
			}
		} else if (this.$clicker.attr('href') && !XenForo.isPositive(this.$clicker.data('closemenu'))) {
			console.warn('Following hyperlink from %o', this.$clicker);
			return true;
		} else if (this.$menu.is(':hidden') && !this.$clicker.hasClass('uix_dropdownDesktopMenu')) {// open menu second -- KC
			this.showMenu(e, false);
		} else {
			this.hideMenu(e, false);
		}
	} else {
		console.debug('Click on control of newly-opened or animating menu, ignored');
	}

	e.preventDefault();
	e.target.blur();
	return false;
};

/**
* Sets the position of the popup menu, based on the position of the control
*/
XenForo.PopupMenu.prototype.setMenuPosition = function(caller) {
	//console.info('setMenuPosition(%s)', caller);

	var $controlParent,
		controlLayout, // control coordinates
		menuLayout, // menu coordinates
		contentLayout, // #content coordinates
		$content,
		$window,
		proposedLeft,
		proposedTop;

	controlLayout = this.$control.coords('outer');

	this.$menu.css('position', '').removeData('position');

	$controlParent = this.$control;
	while ($controlParent && $controlParent.length && $controlParent.get(0) != document) {
		if ($controlParent.css('position') == 'fixed' && (!this.$menu.hasClass('uix_fixIOSClick') || (!uix.iosDevice && this.$menu.hasClass('uix_fixIOSClick')))) {
			controlLayout.top -= $(window).scrollTop();
			controlLayout.left -= $(window).scrollLeft();

			this.$menu.css('position', 'fixed').data('position', 'fixed');
			break;
		}

		$controlParent = $controlParent.parent();
	}

	this.$control.removeClass('BottomControl');

	// set the menu to sit flush with the left of the control, immediately below it
	this.$menu.removeClass('BottomControl').css(
	{
		left: controlLayout.left,
		top: controlLayout.top + controlLayout.height - 1 // fixes a weird thing where the menu doesn't join the control
	});

	menuLayout = this.$menu.coords('outer');

	$content = $('#content .pageContent');
	if ($content.length) {
		contentLayout = $content.coords('outer');
	} else {
		contentLayout = $('body').coords('outer');
	}

	$window = $(window);
	var sT = $window.scrollTop(),
		sL = $window.scrollLeft(),
		windowWidth = $window.width();

	/*
	 * if the menu's right edge is off the screen, check to see if
	 * it would be better to position it flush with the right edge of the control.
	 * RTL displays will try to do this if possible.
	 */
	if (XenForo.isRTL() || menuLayout.left + menuLayout.width > contentLayout.left + contentLayout.width) {
		proposedLeft = Math.max(0, controlLayout.left + controlLayout.width - menuLayout.width);
		if (proposedLeft > sL) {
			this.$menu.css('left', proposedLeft);
		}
	}

	if (parseInt(this.$menu.css('left'), 10) + menuLayout.width > windowWidth + sL) {
		this.$menu.css('left', 0);
	}

	/*
	 * if the menu's bottom edge is off the screen, check to see if
	 * it would be better to position it above the control
	 */
	if (menuLayout.top + menuLayout.height > $window.height() + sT) {
		proposedTop = controlLayout.top - menuLayout.height;
		if (proposedTop > sT) {
			this.$control.addClass('BottomControl');
			this.$menu.addClass('BottomControl');
			this.$menu.css('top', controlLayout.top - this.$menu.outerHeight());
		}
	}
};

XenForo.PopupMenu.prototype.showMenu = function(e, instant) {
	if (this.$menu.is(':visible')) {
		return false;
	}

	//console.log('Show menu event type = %s', e.type);

	var $eShow = new $.Event('PopupMenuShow');
	$eShow.$menu = this.$menu;
	$eShow.instant = instant;
	$(document).trigger($eShow);

	if ($eShow.isDefaultPrevented()) {
		return false;
	}

	this.menuVisible = true;

	this.setMenuPosition('showMenu');

	if (this.$menu.hasClass('BottomControl')) {
		instant = true;
	}

	if (this.contentSrc && !this.loading) {
		this.loading = XenForo.ajax(
			this.contentSrc, '',
			$.context(this, 'loadSuccess'),
			{type: 'GET'}
		);

		this.$menu.find('.Progress').addClass('InProgress');

		instant = true;
	}

	this.setActiveGroup();

	this.$control.addClass('PopupOpen').removeClass('PopupClosed');

	this.$menu.stop().xfSlideDown((instant ? 0 : uix.dropdownMenuAnimationSpeed), $.context(this, 'menuShown'));

	if (!this.menuEventsInitialized) {
		// TODO: make this global?
		// TODO: touch interfaces don't like this
		$(document).bind({
			PopupMenuShow: $.context(this, 'hideIfOther')
		});

		// Webkit mobile kinda does not support document.click, bind to other elements
		if (XenForo._isWebkitMobile) {
			$(document.body.children).click($.context(this, 'hideMenu'));
		} else {
			$(document).click($.context(this, 'hideMenu'));
		}

		var $html = $('html'), t = this, htmlSize = [$html.width(), $html.height()];
		$(window).bind({
			resize: function(e) {
				// only trigger close if the window size actually changed - some mobile browsers trigger without size change
				var w = $html.width(), h = $html.height();
				if (w != htmlSize[0] || h != htmlSize[1]) {
					htmlSize[0] = w; htmlSize[1] = h;
					t._hideMenu(e);
				}
			}
		});

		this.$menu.delegate('a', 'click', $.context(this, 'menuLinkClick'));
		this.$menu.delegate('.MenuCloser', 'click', $.context(this, 'hideMenu'));

		this.menuEventsInitialized = true;
	}
};

// #######################################################################################
// #																					 #
// #							XenForo's Responsive Nav Tabs							 #
// #																					 #
// #######################################################################################
// Override xenforo's default nav tabs code to better support themes.  .uix_showInNav will never be hidden

XenForo.updateVisibleNavigationTabs = function() {
	var $tabs = $('#navigation').find('.navTabs');
	if (!$tabs.length) {
		return;
	}

	var	tabsCoords = $tabs.coords(),
		$publicTabs = $tabs.find('.publicTabs'),
		$publicInnerTabs = $publicTabs.find('> .navTab'),
		$visitorTabs = $tabs.find('.visitorTabs'),
		$visitorInnerTabs = $visitorTabs.find('> .navTab'),
		$visitorCounter = $('#VisitorExtraMenu_Counter'),
		maxPublicWidth,
		$hiddenTab = $publicInnerTabs.filter('.navigationHiddenTabs');

	$publicInnerTabs.show();
	$hiddenTab.hide();

	$visitorInnerTabs.show();
	$visitorCounter.addClass('ResponsiveOnly');

	if ($tabs.is('.showAll')) {
		return;
	}

	maxPublicWidth = $tabs.width() - $visitorTabs.width();

	var hidePublicTabs = function() {
		var shownSel = '.selected, .navigationHiddenTabs, .uix_showInNav';

		var $hideable = $publicInnerTabs.filter(':not(' + shownSel + ')'),
			$hiddenList = $('<ul />'),
			hiddenCount = 0,
			overflowMenuShown = false;

		$.each($hideable.get().reverse(), function() {
			var $this = $(this);

			if (isOverflowing($publicTabs.coords(), true, true)) {
				$hiddenList.prepend(
					$('<li />').html($this.find('.navLink').clone())
				);
				$this.hide();
				hiddenCount++;
			} else {
				if (hiddenCount) {
					$hiddenTab.show();

					if (isOverflowing($publicTabs.coords(), true, true)) {
						$hiddenList.prepend(
							$('<li />').html($this.find('.navLink').clone())
						);
						$this.hide();
						hiddenCount++;
					}
					$('#NavigationHiddenMenu').html($hiddenList).xfActivate();
					overflowMenuShown = true;
				} else {
					$hiddenTab.hide();
				}

				return false;
			}
		});

		if (hiddenCount && !overflowMenuShown) {
			$hiddenTab.show();
			$('#NavigationHiddenMenu').html($hiddenList).xfActivate();
		}
	},
	hideVisitorTabs = function() {
		$visitorInnerTabs.hide();
		$visitorInnerTabs.filter('.account, .selected, .uix_searchTab, .uix_showInNav').show();
		$visitorCounter.removeClass('ResponsiveOnly');
	},
	isOverflowing = function(coords, checkMax, checkVisitor) {
		if (coords.top >= tabsCoords.top + tabsCoords.height || coords.height >= tabsCoords.height * 2) {
			return true;
		}

		if (checkVisitor && $visitorTabs.length && coords.top < $visitorTabs.coords().top) {
			return true;
		}

		if (checkMax && coords.width > maxPublicWidth) {
			return true;
		}

		return false;
	};

	if ($visitorTabs.length) {
		if (isOverflowing($visitorTabs.coords())) {
			hidePublicTabs();

			if (isOverflowing($visitorTabs.coords())) {
				hideVisitorTabs();
			}
		}
	} else if (isOverflowing($publicTabs.coords())) {
		hidePublicTabs();
	}
};

// #######################################################################################
// #																					 #
// #								XenForo's Activate 					 				 #
// #																					 #
// #######################################################################################
// override to extend initializing sliding signature and collapsible user info

XenForo.activate = function(element) {
	var $element = $(element);

	console.group('XenForo.activate(%o)', element);

	$element.trigger('XenForoActivate').removeClass('__XenForoActivator');
	$element.find('noscript').empty().remove();

	XenForo._TimestampRefresh.refresh(element, true);

	$(document)
		.trigger({element: element, type: 'XenForoActivateHtml'})
		.trigger({element: element, type: 'XenForoActivatePopups'})
		.trigger({element: element, type: 'XenForoActivationComplete'});

	var $form = $element.find('form.AutoSubmit:first');
	if ($form.length) {
		$(document).trigger('PseudoAjaxStart');
		$form.submit();
		$form.find('input[type="submit"], input[type="reset"]').hide();
	}

	XenForo.checkQuoteSizing($element);
	XenForo.plusoneButtonInit(element);
	XenForo.Facebook.start();

	if (uix.initDone && uix.signatureHidingEnabled && uix.signatureHidingEnabledAddon && uix.user.signatureHiding) {
		window.setTimeout(function() {
			uix.messageSignature.init();
			uix.messageSignature.check();
		}, 0);
	}

	if ((uix.threadSlidingAvatar || uix.threadSlidingExtra) && uix.user.collapseUserInfo && uix.threadSlidingGlobalEnable) {
		window.setTimeout(function() {
			uix.messageInfo.init();
		}, 0);
	}

	if (uix.initDone) {
		uix.dateHelper.init();
	}

	console.groupEnd();
	return element;
};

// #######################################################################################
// #																					 #
// #								XenForo's Activate 					 				 #
// #																					 #
// #######################################################################################
// override to not hide inline alerts until mouse out

uix.navtabWatch = {
	activeTab: false,

	init: function() {
		uix.navtabWatch.initGet();
		uix.navtabWatch.initSet();
	},

	initGet: function() {
		$('.visitorTabs .navTab').mouseenter(function() {
			uix.navtabWatch.activeTab = true;
		});

		$('.visitorTabs .navTab').mouseout(function() {
			uix.navtabWatch.activeTab = false;
		});
	},

	initSet: function() {

	}
};

XenForo.balloonCounterUpdate = function($balloon, newTotal) {
	if ($balloon.length) {
		var $counter = $balloon.find('span.Total'),
			oldTotal = $counter.text();

		$counter.text(newTotal);

		if (!newTotal || newTotal == '0') {
			if (uix.inlineAlertBalloons) {
				var navTab = $('#AlertsMenu_Counter').closest('.navTab');
				if (navTab.length && uix.navtabWatch.activeTab) {
					navTab.mouseout(function() {
						$balloon.addClass('Zero').css('display', '');
						navTab.unbind('mouseout');
					});
				} else {
					$balloon.addClass('Zero').css('display', '');
				}
			} else {
				$balloon.fadeOut('fast', function() {
					$balloon.addClass('Zero').css('display', '');
				});
			}
		} else {
			$balloon.fadeIn('fast', function() {
				$balloon.removeClass('Zero').css('display', '');

				var oldTotalInt = parseInt(oldTotal.replace(/[^\d]/, ''), 10),
					newTotalInt = parseInt(newTotal.replace(/[^\d]/, ''), 10),
					newDifference = newTotalInt - oldTotalInt;

				if (newDifference > 0 && $balloon.data('text')) {
					var $container = $balloon.closest('.Popup'),
						PopupMenu = $container.data('XenForo.PopupMenu'),
						$message;

					$message = $('<a />').css('cursor', 'pointer').html($balloon.data('text').replace(/%d/, newDifference)).click(function(e) {
						if ($container.is(':visible') && PopupMenu) {
							PopupMenu.$clicker.trigger('click');
						} else if ($container.find('a[href]').length) {
							window.location = XenForo.canonicalizeUrl($container.find('a[href]').attr('href'));
						}
						return false;
					});

					if (PopupMenu && !PopupMenu.menuVisible) {
						PopupMenu.resetLoader();
					}

					XenForo.stackAlert($message, 10000, $balloon);
				}
			});
		}
	}
};

uix.getScrollTop = function() {
	return document.body.scrollTop || document.documentElement.scrollTop;
};

uix.getScrollLeft = function() {
	return document.body.scrollLeft || document.documentElement.scrollLeft;
};

uix.replace = function(str, search, replace) {
	return str.split(search).join(replace);
};

uix.resizeFire = function() {
	if (document.createEvent) { // W3C
		var ev = document.createEvent('Event');
		ev.initEvent('resize', true, true);
		window.dispatchEvent(ev);
	} else { // IE
		document.fireEvent('onresize');
	}
};

// #######################################################################################
// #																					 #
// #									UIX Functions									 #
// #																					 #
// #######################################################################################

uix.getCookie = function(name) { // allows getting cookie values before xenforo.init()
	var expr, cookie;

	expr = new RegExp('(^| )' + uix.cookiePrefix + name + '=([^;]+)(;|$)');
	cookie = expr.exec(document.cookie);

	if (cookie)	{
		return decodeURIComponent(cookie[2]);
	}
	return null;
};

uix.isSet = function(val) {
	if (typeof(val) === 'undefined') {
		return false;
	}
	if (val === null) {
		return false;
	}
	return true;
};

uix.fn.getKeys = function(obj) {
	if (typeof(obj) === 'object') {
		return Object.keys(obj);
	}
	return null;
};

uix.fn.jumpToFixed = function() {
	var pfTime = uix.time();
	if (uix.jumpToFixedDelayHide && uix.jumpToScrollTimer) {
		clearTimeout(uix.jumpToScrollTimer); // clear any previous pending timer
		clearTimeout(uix.jumpToScrollHideTimer);
	}

	if (uix.scrollTop > 140 && uix.initDone) {
		if (uix.jumpToFixedOpacity === 0) {
			window.requestAnimationFrame(function() {
				uix.elm.jumpToFixed.css({
					'display': 'block'
				});
				uix.jumpToFixedOpacity = 1;
				window.requestAnimationFrame(function() {
					uix.elm.jumpToFixed.css({
						'opacity': '1'
					});
				});
			});
		}
		if (uix.jumpToFixedDelayHide == 1) {
			uix.jumpToScrollTimer = setTimeout(function() {
				window.requestAnimationFrame(function() {
					uix.jumpToScrollTimer = null;
					uix.jumpToFixedOpacity = 0;
					uix.elm.jumpToFixed.css({'opacity': '0'});
					uix.jumpToScrollHideTimer = window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							if (uix.jumpToFixedOpacity === 0) {
								uix.elm.jumpToFixed.css({'display': 'none'});
							}
						});
					}, 450);
				});
			}, 1500); // set new timer
		}
	} else {
		if (uix.jumpToFixedOpacity !== 0) {
			uix.jumpToFixedOpacity = 0;
			uix.elm.jumpToFixed.css({'opacity': '0'});
		}
		uix.jumpToScrollHideTimer = window.setTimeout(function() {
			window.requestAnimationFrame(function() {
				if (uix.jumpToFixedOpacity === 0) {
					uix.elm.jumpToFixed.css({'display': 'none'});
				}
			});
		}, 450);
	}
	uix.tStamp('UIX.fn.jumpToFixed', 2, pfTime);
};

uix.fn.scrollToAnchor = function(href) {
	href = typeof(href) == 'string' ? href : $(this).attr('href');
	if (!href) {
		return;
	}
	if (href.indexOf('#') !== -1) {
		var split = href.split('#');
		if (split.length == 2 && split[1].length > 0) {

			var $target = $('a[href=\'' + href + '\']');
			if ($target.length) {
				uix.sticky.preventStickyTop = true;
				var topOffset = $target.offset().top;
				$('html, body').animate({
					scrollTop: topOffset - uix.sticky.getOffset(topOffset)
				}, XenForo.speed.normal, 'swing', function() {
					uix.sticky.preventStickyTop = false;
					uix.sticky.check();
				});

				if (history && 'pushState' in history) {
					history.pushState({}, document.title, window.location.pathname + window.location.search + '#' + split[1]);
					return false;
				}
			}
		}
	}
};

uix.fn.postSearchMinimalShow = function() {
	var sel = document.getElementById('uix_searchMinimalInput');
	if (uix.isSet(sel) && sel.children.length > 0) {
		window.setTimeout(function() {
			sel.children[0].focus();
		}, 700);
	}
	uix.searchMinimalState = 1;
	$('#uix_searchMinimal').addClass('show');
};

uix.fn.postSearchMinimalHide = function() {
	uix.searchMinimalState = 0;
	$('#uix_searchMinimal').removeClass('show');
	var withSearch = $('.withSearch');
	if (withSearch.length) {
		withSearch.removeClass('uix_searchMinimalActive');
	}
};

uix.fn.searchClick = function() {
	var withSearch = $('.withSearch'),
		searchMinimal = $('#uix_searchMinimal');
	if (withSearch.length && uix.searchMinimalState <= 0) {
		withSearch.addClass('uix_searchMinimalActive');
	}

	if (uix.searchMinimalState == -1) {
		uix.searchMinimalState = 0;
	}
	if (uix.searchMinimalState === 0) {
		uix.fn.postSearchMinimalShow();
	} else {
		uix.fn.postSearchMinimalHide();
	}
};

uix.fn.syncBaloon = function($source, $dest) {
	if ($source.length && $dest.length) {
		var $sourceCounter = $source.find('span.Total'),
			total = $sourceCounter.text(),
			$destCounter = $dest.find('span.Total'),
			oldTotal = $destCounter.text();

		if (total != oldTotal) {
			$destCounter.text(total);

			if (total == '0') {
				$dest.fadeOut('fast', function() {
					$dest.addClass('Zero').css('display', '');
				});
			} else {
				$dest.fadeIn('fast', function() {
					$dest.removeClass('Zero').css('display', '');
				});
			}
		}
	}
};

uix.hideDropdowns = {
	eles: null,

	init: function() {
		uix.hideDropdowns.eles = $('body > .Menu');
	},

	hide: function() {
		uix.hideDropdowns.init();
		if (uix.hideDropdowns.eles !== null) {
			uix.hideDropdowns.eles.css('display', 'none');
		}
	}
};

// #######################################################################################
// #																					 #
// #							 UIX Initialization Functions							 #
// #																					 #
// #######################################################################################

uix.init.welcomeBlock = function() {
	var pfTime = uix.time();
	if (uix.elm.welcomeBlock.length && uix.elm.welcomeBlock.hasClass('uix_welcomeBlock_fixed')) {

		if ($.getCookie('uix_hiddenWelcomeBlock') == 1) {
			if (uix.reinsertWelcomeBlock) {
				uix.elm.welcomeBlock.removeClass('uix_welcomeBlock_fixed');
			}
		} else {
			uix.elm.welcomeBlock.css({
				'display': 'block'
			});
		}

		uix.elm.welcomeBlock.find('.close').on('click', function(e) {
			e.preventDefault();
			$.setCookie('uix_hiddenWelcomeBlock', 1);
			window.requestAnimationFrame(function() {
				uix.elm.welcomeBlock.css({
					'opacity': '0'
				});
				window.setTimeout(function() {
					window.requestAnimationFrame(function() {
						if (uix.reinsertWelcomeBlock) {
							uix.elm.welcomeBlock.removeClass('uix_welcomeBlock_fixed');
							uix.elm.welcomeBlock.css('opacity', 1);
							if (uix.sidebarSticky.running) {
								uix.sidebarSticky.update();
							}
						} else {
							uix.elm.welcomeBlock.css({
								'display': 'none'
							});
						}
					});
				}, 500);
			});
		});
	}

	uix.tStamp('UIX.init.welcomeBlock', 1, pfTime);
};

uix.init.jumpToFixed = function() {
	var pfTime = uix.time();
	var scrollToThe = function(ele) {
		if (ele.length === 1) {
			var pfTime2 = uix.time(),
				pos = ele.data('position'),
				targetEle = null,
				targetId = ele[0].href,
				targetPos = null;

			if (uix.isSet(targetId) && targetId.length) {
				targetId = targetId.split('#');
				if (targetId.length === 2) {
					targetEle = document.getElementById(targetId[1]);
				} else {
					targetEle = document.body;
				}
			} else {
				targetEle = document.body;
			}

			if (targetEle !== null) {
				if (pos == 'bottom') {
					targetPos = targetEle.offsetTop + targetEle.offsetHeight - uix.windowHeight + uix.globalPadding;
				} else {
					targetPos = targetEle.offsetTop;
					targetPos -= uix.sticky.getOffset(targetPos) - uix.globalPadding;
				}
			} else {
				if (pos == 'bottom') {
					targetPos = $(document).height();
				} else {
					targetPos = 0;
				}
			}

			if (targetPos !== null) {
				uix.sticky.preventStickyTop = true; // stop sliding sticky from sticking
				$('html, body').stop().animate({
					scrollTop: targetPos
				}, 400);
				window.setTimeout(function() {
					uix.sticky.preventStickyTop = false;
				}, 400); // reallow sliding sticky to stick
			}

			uix.tStamp('UIX.init.jumpToFixed', 2, pfTime2);
		}
		return false;
	};

	var jumpToFixed = uix.elm.jumpToFixed;

	$('.topLink').on('click', function() {
		scrollToThe($('#XenForo'));
	});

	if (jumpToFixed.length) {
		jumpToFixed.find('a').on('click', function(e) {
			e.preventDefault();
			scrollToThe($(this));
		});

		if (uix.jumpToFixedDelayHide) {
			jumpToFixed.hover(
				function() {
					clearTimeout(uix.jumpToScrollTimer);
					clearTimeout(uix.jumpToScrollHideTimer);
					window.requestAnimationFrame(function() {
						jumpToFixed.css({
							'display': 'block'
						});
						uix.jumpToFixedOpacity = 1;
						window.requestAnimationFrame(function() {
							jumpToFixed.css({
								'opacity': '1'
							});
						});
					});
				},
				function() {
					window.requestAnimationFrame(function() {
						uix.jumpToFixedOpacity = 0;
						jumpToFixed.css({
							'opacity': '0'
						});
						uix.jumpToScrollHideTimer = window.setTimeout(function() {
							window.requestAnimationFrame(function() {
								if (uix.jumpToFixedOpacity === 0) {
									jumpToFixed.css({
										'display': 'none'
									});
								}
							});
						}, 450);
					});
				}
			);
		}
		uix.jumpToFixedRunning = true;
	}
	uix.tStamp('UIX.init.jumpToFixed', 1, pfTime);
};

uix.fixScrollLocation = {
	fixCount: 0,
	topOffset: 0,
	needsInitGet: true,

	initGet: function() {
		var hash = document.location.hash;
		if (hash == '#_=_' || hash.indexOf('#.') > 0) {
			hash = '';
		}
		if (hash.length > 2 && uix.sticky.scrollDetectorRunning === false) {
			var pfTime = uix.time();
			var $target = $(hash);
			if ($target.length) {
				uix.fixScrollLocation.topOffset = $target.offset().top;
			}
			uix.tStamp('UIX.fixScrollLocation.initGet', 1, pfTime);
		}

		uix.fixScrollLocation.needsInitGet = false;
	},

	initSet: function() {
		if (uix.fixScrollLocation.needsInitGet) {
			uix.fixScrollLocation.initGet();
		}

		window.setTimeout(function() {
			if (uix.fixScrollLocation.topOffset > 0) {
				var pfTime = uix.time(),
					newScroll = uix.fixScrollLocation.topOffset - uix.sticky.getOffset(uix.fixScrollLocation.topOffset);

				if (newScroll > 0) {
					window.scrollTo(0, newScroll);
					uix.sidebarSticky.resize();
				}
				uix.tStamp('UIX.fixScrollLocation.initSet', 1, pfTime);
			}
		}, 1);
	},

	init: function() {
		uix.fixScrollLocation.initGet();
		uix.fixScrollLocation.initSet();
	}
};

uix.fixMenu = function(ele) {
	var menu = $(ele).closest('.Menu');
	if (menu.length) {
		if (uix.iosDevice) {
			uix.blockScrollEvents = true;
			menu.css({position: 'absolute', top: uix.scrollTop + 'px'});
			window.scrollTo(0, uix.scrollTop);
			window.setTimeout(function() {
				uix.blockScrollEvents = false;
			}, 100);
		}
	}
};

uix.deviceSpecific = {
	offCanvasMovePost: function() {
		if (uix.userAgent.match(/(iPod|iPhone|iPad)/)) {
			for (var i = 1; i < 8; i++) {
				if (uix.userAgent.indexOf('OS ' + i + '_') > -1) {
					uix.deviceSpecific.offCanvasMoveFunc();
				}
			}
		}
	},

	offCanvasMoveFunc: function() {
		uix.offcanvas.sidePanes.css('visibility', 'hidden');
		window.requestAnimationFrame(function() {
			uix.offcanvas.sidePanes.css('visibility', '');
		});
	},

	offCanvasMovePre: function() {
		if (uix.userAgent.indexOf('Android 4.1') > -1 ||  uix.userAgent.indexOf('Android 4.2') > -1) {
			window.scrollTo(0, 0);
			uix.sticky.check();
		}
	},

	offCanvasTriggerInit: function() {
		if (uix.userAgent.indexOf('Android 4.1') === -1 && uix.userAgent.indexOf('Android 4.2') === -1) {
			uix.offcanvas.sidePanes.css('position', 'fixed');
		}
	}
};

uix.initFixMenu = function() {
	$('.uix_fixIOSClickInput').click(function() {
		uix.fixMenu(this);
	});
};

uix.init.offCanvasVisitor = function() {
	window.setInterval(function() {
		uix.fn.syncBaloon($('#VisitorExtraMenu_Counter'), $('#uix_VisitorExtraMenu_Counter'));
		uix.fn.syncBaloon($('#ConversationsMenu_Counter'), $('#uix_ConversationsMenu_Counter'));
		uix.fn.syncBaloon($('#AlertsMenu_Counter'), $('#uix_AlertsMenu_Counter'));
	}, 3000);
};

uix.init.search = function() {
	if ($('#searchBar.hasSearchButton').length) {
		$('#QuickSearch .primaryControls span').click(function(e) {
			e.preventDefault();
			$('#QuickSearch > .formPopup').submit();
		});
	}

	var quickSearch = $('#QuickSearchQuery');
	var minSearch = $('#uix_searchMinimalInput input');
	if (quickSearch.length && minSearch.length) { // sync inputs for quick search and minimal search
		quickSearch.on('change', function() { minSearch.val(quickSearch.val()); });
		minSearch.on('change', function() { quickSearch.val(minSearch.val()); });
	}

	if (uix.searchMinimalSize > 0 && $('#QuickSearchPlaceholder').length) {
		uix.init.searchClick();
		uix.checkSearchResize = true;

		$('#uix_searchMinimalClose').on('click', function(e) {
			e.preventDefault();
			if (uix.searchMinimalState === 1) {
				uix.fn.searchClick();
			}
		});

		$('#uix_searchMinimalOptions').on('click', function(e) {
			e.preventDefault();

			if (uix.searchMinimalState === 1) {
				var delay = 0;
				if (uix.searchMinimalState == 1) {
					delay = 400;
					uix.fn.searchClick();
				}
				setTimeout(function() {
					window.requestAnimationFrame(function() {
						$('#QuickSearch').css({
							'opacity': 0,
							'transtion': 'opacity 0.3s'
						});
						window.requestAnimationFrame(function() {
							$('#QuickSearch').addClass('show');
							$('#QuickSearchPlaceholder').addClass('hide');
							window.requestAnimationFrame(function() {
								$('#QuickSearch').css({
									'opacity': 1
								});
								$('#QuickSearchQuery').focus();
								window.setTimeout(function() {
									window.requestAnimationFrame(function() {
										$('#QuickSearch').css({
											'opacity': '',
											'transtion': ''
										});
									});
								}, 300);
							});
						});
					});
				}, delay);
			}
		});
	}
};

uix.init.searchClick = function() {
	if (uix.windowWidth > uix.searchMinimalSize && uix.slidingSearchEnabled !== 0) {
		$('#QuickSearchPlaceholder').unbind('click');
		$('#QuickSearchPlaceholder').click(function(e) {
			e.preventDefault();
			window.requestAnimationFrame(function() {
				$('#QuickSearch').addClass('show');
				$('#QuickSearchPlaceholder').addClass('hide');
				$('#QuickSearchQuery').focus();
			});
		});
		uix.slidingSearchEnabled = 0;
	} else if (uix.windowWidth <= uix.searchMinimalSize && uix.slidingSearchEnabled != 1) {
		$('#QuickSearchPlaceholder').unbind('click');
		$('#QuickSearchPlaceholder').on('click', function(e) {
			e.preventDefault();
			uix.fn.searchClick();
		});
		uix.slidingSearchEnabled = 1;
	}
	if (uix.searchMinimalState == 1 && uix.windowWidth >= uix.searchMinimalSize) {
		uix.fn.postSearchMinimalHide();
	}
};

uix.init.offsetAnchors = function() {
	var anchors = document.getElementsByTagName('a');
	for (var i = 0, len = anchors.length; i < len; i++) {
		var a = anchors[i],
			href = a.href;
		if (href.indexOf('#') !== -1) {
			var split = href.split('#');
			if (split.length == 2 && split[1].length > 0) {
				var addListener = true;
				var parEle = a.parentElement;
				if (uix.isSet(a.className) && a.className.indexOf('AttributionLink') !== -1) {
					addListener = false;
				} else if (parEle.className.indexOf('navControls') !== -1) {
					addListener = false;
				} else if (parEle.className.indexOf('uix_noLinkOffset') !== -1) {
					addListener = false;
				} else if (parEle.className.indexOf('topLink') !== -1) {
					addListener = false;
				} else if (parEle.className.indexOf('messageDetails') !== -1) {
					addListener = false;
				} else if (parEle.className.indexOf('messageText') !== -1) {
					addListener = false;
				} else if (parEle.id == 'uix_jumpToFixed') {
					addListener = false;
				} else if (uix.isSet(parEle.parentElement.className) && parEle.parentElement.className.indexOf('Tabs') !== -1) {
					addListener = false;
				} else if (addListener) {
					a.addEventListener('click', uix.fn.scrollToAnchor);
				}
			}
		}
	}

	if ('onhashchange' in window) {
		window.onhashchange = uix.fixScrollLocation.init;
	}
};

uix.init.fixPrefixMenus = function() {
	$('.Menu.PrefixMenu').on('click', function() {
		$(window).trigger('resize');
	});
};

uix.navTabs = function() {
	if (uix.windowWidth > uix.offCanvasNavTriggerWidth) {
		XenForo.updateVisibleNavigationTabs();
	}
};

uix.jsVersion = '1.5.6.0';

uix.initGlobalVars = function() {
	//UIX variables
	uix.windowWidth = 0;
	uix.windowHeight = 0;
	uix.documentHeight = 0;
	uix.scrollTop = 0;

	uix.elm = {
		html: $('html'),
		navigation: $('#navigation'),
		logo: $('#logo'),
		logoSmall: $('#logo_small'),
		jumpToFixed: $('#uix_jumpToFixed'),
		mainContainer: $('.mainContainer'),
		mainContent: $('.mainContent', uix.elm.mainContainer),
		welcomeBlock: $('#uix_welcomeBlock'),
		sidebar: $('.uix_mainSidebar'),
		sidebarInner: $('.sidebar', uix.elm.sidebar),
		sidebarInnerWrapper: $('.inner_wrapper', uix.elm.sidebar)
	};

	uix.hasSticky = Object.keys(uix.stickyItems).length > 0 ? true : false;
	uix.contentHeight = uix.elm.mainContent.outerHeight();
	uix.emBreak = uix.elm.mainContainer.scrollTop();
	uix.slidingSidebar = true; // if false, disable transition for sliding sticky's sidebar
	uix.jumpToScrollTimer = null;
	uix.jumpToScrollHideTimer = null;
	uix.jumpToFixedRunning = false;
	uix.jumpToFixedOpacity = 0;
	uix.stickyForceDisable = false;
	uix.slidingSearchEnabled = 0;
	uix.searchMinimalState = -1;
	uix.logoVisible = 0;
	uix.pfLog = false; // if true, will output timers for most functions for performance testing
	uix.pfTime = uix.time(true); // used for timing performance testing
	uix.initTime = null;
	uix.xfTime = null;
	uix.initDone = false;
	uix.updateNavTabs = false;
	uix.initLog = [];
	uix.landscapeOrientation = true;
	uix.checkSearchResize = false;
	uix.blockScrollEvents = false;
	uix.iosDevice = false;
	uix.userAgent = navigator.userAgent;

	if (typeof(uix.sidebarMaxResponsiveWidthStr) === 'string' && uix.sidebarMaxResponsiveWidthStr.replace(' ', '') == '100%') {
		uix.sidebarMaxResponsiveWidth = 999999;
	}
};

uix.initFunc = function() {
	uix.initGlobalVars();

	$(window).on('load', uix.messageSignature.check);
	$(window).on('load', function() {
		uix.fixScrollLocation.init();

		window.setTimeout(function() {
			uix.fixScrollLocation.init();
		}, 500);
	});

	uix.initGet = function() {
		uix.logI('Pre UIX Viewport Init');
		uix.slidingSidebar = false;
		uix.viewport.init();

		uix.logI('Pre UIX Welcome Block Init');
		uix.init.welcomeBlock();

		uix.logI('Pre UIX AdminLinks Init Get');
		uix.setupAdminLinks.initGet();

		uix.logI('Pre UIX Main Sidebar Init Get');
		uix.sidebar.initGet();

		uix.logI('Pre UIX Collapsible Nodes Init Get');
		uix.collapsible.initGet();

		if (uix.hasSticky) {
			var userAgent = uix.userAgent,
				i;
			if (userAgent.match(/(iPod|iPhone|iPad)/)) {
				uix.iosDevice = true;
				uix.initFixMenu();
			}

			if (uix.stickyDisableIOSThirdParty) {
				if (userAgent.match(/(iPod|iPhone|iPad)/)) {
					for (i = 1; i < 8; i++) {
						if (userAgent.indexOf('OS ' + i + '_') > -1) {
							uix.stickyForceDisable = true;
						}
					}
					if (userAgent.indexOf('OS 8_') > -1 && userAgent.indexOf('Version/') == -1) {
						uix.stickyForceDisable = true; // non-safari
					}
					if (userAgent.indexOf('OS 9_') > -1 && userAgent.indexOf('Version/') == -1) {
						uix.stickyForceDisable = true; // non-safari
					}
				} else if (userAgent.match(/Android/)) {
					for (i = 1; i < 4; i++) {
						if (userAgent.indexOf('Android ' + i) > -1) {
							uix.stickyForceDisable = true;
						}
					}
				}
			}

			if (!uix.stickyForceDisable) {
				uix.logI('Pre UIX Sticky Init Get');
				uix.sticky.initGet();

				uix.logI('Pre UIX SmallLogo Init Get');
				uix.smallLogo.initGet();

				uix.logI('Pre UIX Fix Scroll Init Get');
				uix.fixScrollLocation.initGet();
			}
		}

		uix.logI('Pre UIX Userbar Check Get');
		uix.userBar.checkGet();

		uix.logI('Pre UIX Scroll Functions Init');
		uix.init.scrollFunctions();

		if (uix.enableStickyFooter) {
			uix.logI('Pre UIX Sticky Footer Init');
			uix.stickyFooter.init();
		}

		if (uix.nodeStyle == 3) {
			uix.logI('Pre UIX Grid Layout Init Get');
			audentio.grid.initGet(); // loads for any width
		}

		if (audentio.pagination.enabled) {
			uix.logI('Pre UIX Pagination Init Get');
			audentio.pagination.initGet();
		}

		if (uix.signatureHidingEnabled && uix.signatureHidingEnabledAddon && uix.user.signatureHiding) {
			uix.logI('Pre Signature Init Get');
			uix.messageSignature.initGet();
		}

		uix.logI('Pre UIX Search Init');
		uix.init.search();

		if (uix.elm.sidebar.length && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth && uix.sidebar.visible == 1 && !uix.stickyForceDisable && uix.user.stickyEnableSidebar && !uix.stickySidebarDelayInit) {
			uix.logI('Pre UIX Sticky Sidebar Init Get');
			uix.sidebarSticky.initGet();
		}

		uix.logI('Pre UIX Resize Init');
		uix.init.resizeFunctions();

		if (uix.enableULManager) {
			uix.logI('Pre UIX UL Manager Check Get');
			uix.ulManager.checkGet();
		}

		if (uix.offCanvasSidebar) {
			uix.logI('Pre UIX Off Canvas Init Get');
			uix.offcanvas.initGet();
		}

		if (uix.enableBorderCheck) {
			uix.logI('Pre UIX Check Radius Init Get');
			uix.checkRadius.initGet();
		}

		uix.logI('Pre UIX Date Helper Init Get');
		uix.dateHelper.initGet();

		if (uix.toggleWidthEnabled) {
			uix.logI('Pre UIX Toggle Width Init Get');
			uix.toggleWidth.initGet();
		}
	};

	uix.initSet = function() {
		if (uix.offCanvasSidebar) {
			uix.logI('Pre UIX Off Canvas Init Set');
			uix.offcanvas.initSet();
		}

		uix.logI('Pre UIX AdminLinks Init Set');
		uix.setupAdminLinks.initSet();

		uix.logI('Pre UIX Main Sidebar Init Set');
		uix.sidebar.initSet();

		uix.logI('Pre UIX Collapsible Nodes Init Set');
		uix.collapsible.initSet();

		uix.logI('Pre UIX Userbar Check Set');
		uix.userBar.checkSet();

		if (uix.hasSticky && !uix.stickyForceDisable) {
			uix.logI('Pre UIX Sticky Init Set');
			uix.sticky.initSet();

			uix.logI('Pre UIX SmallLogo Init Set');
			uix.smallLogo.initSet();

			uix.logI('Pre UIX Fix Scroll Init Set');
			uix.fixScrollLocation.initSet();
		}

		if (uix.enableULManager) {
			uix.logI('Pre UIX UL Manager Check Set');
			uix.ulManager.checkSet();
		}

		if (uix.nodeStyle == 3) {
			uix.logI('Pre UIX Grid Layout Init Set');
			audentio.grid.initSet(); // loads for any width
		}

		if (audentio.pagination.enabled) {
			uix.logI('Pre UIX Pagination Init Set');
			audentio.pagination.initSet();
		}

		if (uix.signatureHidingEnabled && uix.signatureHidingEnabledAddon && uix.user.signatureHiding) {
			uix.logI('Pre Signature Init Set');
			uix.messageSignature.initSet();
		}

		if (uix.elm.sidebar.length && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth && uix.sidebar.visible == 1 && !uix.stickyForceDisable && uix.user.stickyEnableSidebar && !uix.stickySidebarDelayInit) {
			uix.logI('Pre UIX Sticky Sidebar Init Set');
			uix.sidebarSticky.initSet();
		}

		uix.logI('Pre UIX content Init');
		if ($('#content.register_form').length) {
			$('#loginBarHandle').hide();
		}

		if (uix.enableStickyFooter) {
			uix.logI('Pre UIX Sticky Footer Set');
			uix.stickyFooter.set();
			if (uix.stickyFooter.state == 1) {
				uix.stickyFooter.check();
			}
		}

		if (uix.enableBorderCheck) {
			uix.logI('Pre UIX Check Radius Init Set');
			uix.checkRadius.initSet();
		}

		uix.logI('Pre UIX Date Helper Init Set');
		uix.dateHelper.initSet();

		if (uix.toggleWidthEnabled) {
			uix.logI('Pre UIX Toggle Width Init Set');
			uix.toggleWidth.initSet();
		}

		if (!Modernizr.flexbox && !Modernizr.flexboxtweener) {
			uix.elm.html.removeClass('hasFlexbox');
		}
	};

	uix.initFuncInner = function() {
		if (uix.betaMode) {
			console.warn('%cUI.X IS IN BETA MODE', 'color:#E74C3C;font-weight:bold');
		}

		uix.initGet();

		uix.slidingSidebar = true;

		if (uix.updateNavTabs) {
			uix.logI('Pre XenForo tab Init');
			uix.navTabs(); // prevented during load to only need to do once.
		}

		if (uix.offCanvasSidebarVisitorTabs) {
			uix.logI('Pre UIX Offcanvas Visitor Tabs Init');
			uix.init.offCanvasVisitor();
		}

		if (!uix.stickyForceDisable) {
			uix.logI('Pre UIX Jump to Fixed Init');
			uix.init.jumpToFixed();
		}

		if (uix.hasSticky && !uix.stickyForceDisable) {
			uix.logI('Pre UIX Offset Anchors'); // Intercept all anchor clicks
			uix.init.offsetAnchors();
		}

		uix.logI('Pre UIX Fix Prefix Menus Init');
		uix.init.fixPrefixMenus();

		if ((uix.threadSlidingAvatar || uix.threadSlidingExtra) && uix.user.collapseUserInfo && uix.threadSlidingGlobalEnable) {
			uix.logI('Pre UIX Message Info Init');
			uix.messageInfo.init();
		}

		uix.initSet();

		if (uix.updateNavTabs) {
			uix.logI('Pre UL second check Init');
			if (uix.enableULManager) {
				uix.ulManager.check();
			}
		}

		if (uix.elm.sidebar.length && uix.stickySidebar && uix.windowWidth > uix.sidebarMaxResponsiveWidth && uix.sidebar.visible == 1 && !uix.stickyForceDisable && uix.user.stickyEnableSidebar) {
			if (uix.stickySidebarDelayInit) {
				$(window).load(function() {
					uix.sidebarSticky.init();
				});
			} else {
				uix.sidebarSticky.resize();
				$(window).load(function() {
					uix.sidebarSticky.resize();
				});
			}
		}
	};

	uix.logI('Pre UIX Init');
	uix.initFuncInner(); //Initialize UIX
	uix.initDone = true;
	uix.initTime = uix.round(uix.time(true) - uix.pfTime, 4);
	uix.log('UI.X initialized in ' + uix.initTime  + ' ms.', 'color:#008F00');
	uix.xfTime = 'Xenforo loaded in ' + (Date.now() - XenForo._pageLoadTime * 1000) + ' ms.  UI.X was ' + uix.round((uix.initTime / (Date.now() - XenForo._pageLoadTime * 1000)) * 100, 2) + '% of that time (' + uix.initTime + ' ms).';

	uix.log(uix.xfTime, 'color:#00A3CC');
	uix.initLog.push(['Post UIX Init', (uix.time(true) - uix.pfTime)]);
};
