if (!Object.isEmpty) {
	Object.isEmpty = function (object) {
		for (let key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	};
}
if (!Object.each) {
	Object.each = function (object, callback, context) {
		for (let key in object) {
			if (object.hasOwnProperty(key)) {
				if (callback.call(context, object[key], key) === false) {
					return false;
				}
			}
		}
		return true;
	};
}
if (!Array.prototype.first) {
	Array.prototype.first = function () {
		if (this.length === 0) {
			return null;
		}
		return this[0];
	};
}
if (!Array.prototype.last) {
	Array.prototype.last = function () {
		if (this.length === 0) {
			return null;
		}
		return this[this.length - 1];
	};
}
if (!Array.prototype.contains) {
	Array.prototype.contains = function (target) {
		return this.indexOf(target) !== -1;
	};
}
if (!Array.prototype.remove) {
	Array.prototype.remove = function (target) {
		for (let i = this.length - 1; i >= 0; i--) {
			if (this[i] === target) {
				this.splice(i, 1);
			}
		}
	};
}
if (!Math.clamp) {
	Math.clamp = function (value, min, max) {
		return Math.min(Math.max(value, min), max);
	};
}
if (!Math.square) {
	Math.square = function (value) {
		return value * value;
	};
}
if (!String.isString) {
	String.isString = function (obj) {
		return typeof obj === 'string' || obj instanceof String;
	};
}
if (!String.prototype.contains) {
	String.prototype.contains = function (target) {
		return this.indexOf(target) !== -1;
	};
}
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}
		return this.substring(this_len - search.length, this_len) === search;
	};
}
let getText = function (el) {
	let nodeType = el.nodeType;
	if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
		if (typeof el.textContent === 'string') {
			return el.textContent;
		}
		else {
			let result = [];
			for (let child = el.firstChild; child; child = child.nextSibling) {
				result.push(getText(child));
			}
			return result.join('');
		}
	}
	else if (nodeType === 3 || nodeType === 4) {
		return el.nodeValue;
	}
	return '';
};
let setText = function (el, val) {
	let nodeType = el.nodeType;
	if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
		el.textContent = val;
	}
};
Element.prototype.getText = function () {
	return getText(this);
};
Element.prototype.setText = function (val) {
	setText(this, val);
};
Element.prototype.addClass = function (...classes) {
	this.addClasses(classes);
};
Element.prototype.addClasses = function (classes) {
	for (let i = 0; i < classes.length; i++) {
		this.classList.add(classes[i]);
	}
};
Element.prototype.removeClass = function (...classes) {
	this.removeClasses(classes);
};
Element.prototype.removeClasses = function (classes) {
	for (let i = 0; i < classes.length; i++) {
		this.classList.remove(classes[i]);
	}
};
Element.prototype.toggleClass = function (classes, value) {
	if (!(classes instanceof Array)) {
		classes = [classes];
	}
	if (value) {
		this.addClasses(classes);
	}
	else {
		this.removeClasses(classes);
	}
};
Element.prototype.hasClass = function (cls) {
	return this.classList.contains(cls);
};
Node.prototype.detach = function () {
	if (this.parentNode) {
		this.parentNode.removeChild(this);
	}
};
Node.prototype.empty = function () {
	while (this.lastChild) {
		this.removeChild(this.lastChild);
	}
};
Node.prototype.insertAfter = function (other) {
	if (other.parentNode) {
		other.parentNode.insertBefore(this, other.nextSibling);
	}
};
Node.prototype.indexOf = function (other) {
	return Array.prototype.indexOf.call(this.childNodes, other);
};
Element.prototype.setAttr = function (qualifiedName, value) {
	this.setAttribute(qualifiedName, String(value));
};
Element.prototype.setAttrs = function (obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			this.setAttr(key, obj[key]);
		}
	}
};
Element.prototype.getAttr = Element.prototype.getAttribute;
if (!HTMLElement.prototype.show) {
	HTMLElement.prototype.show = function () {
		let display = this.style.display;
		if (display === 'none') {
			// Restore a pre-hide() value if we have one
			this.style.display = this.getAttribute('data-display') || '';
			this.removeAttribute('data-display');
		}
	};
}
if (!HTMLElement.prototype.hide) {
	HTMLElement.prototype.hide = function () {
		let display = this.style.display;
		if (display !== 'none') {
			this.style.display = 'none';
			// Remember the value we're replacing
			if (display) {
				this.setAttribute('data-display', display);
			}
			else {
				this.removeAttribute('data-display');
			}
		}
	};
}
window.fish = function (selector) {
	return document.querySelector(selector);
};
window.fishAll = function (selector) {
	return Array.prototype.slice.call(document.querySelectorAll(selector));
};
Element.prototype.find = function (selector) {
	return this.querySelector(selector);
};
Element.prototype.findAll = function (selector) {
	return Array.prototype.slice.call(this.querySelectorAll(selector));
};
Node.prototype.createEl = function (tag, o, callback) {
	o = o || {};
	o.parent = this;
	return createEl(tag, o, callback);
};
Node.prototype.createDiv = function (o, callback) {
	return this.createEl('div', o, callback);
};
Node.prototype.createSpan = function (o, callback) {
	return this.createEl('span', o, callback);
};
window.createEl = function createEl(tag, o, callback) {
	let {cls, text, attr, title, value, type, parent} = o || {};
	let el = document.createElement(tag);
	if (cls) {
		if (Array.isArray(cls)) {
			el.className = cls.join(' ');
		}
		else {
			el.className = cls;
		}
	}
	if (text) {
		el.setText(text);
	}
	if (attr) {
		el.setAttrs(attr);
	}
	if (title) {
		el.title = title;
	}
	if (value && (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLOptionElement)) {
		el.value = value;
	}
	if (type && el instanceof HTMLInputElement) {
		el.type = type;
	}
	if (callback) {
		callback(el);
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
};
window.createDiv = function createDiv(o, callback) {
	return createEl('div', o, callback);
};
window.createSpan = function createSpan(o, callback) {
	return createEl('span', o, callback);
};
function matchPath(element, selector, lastParent) {
	if (!element) {
		return null;
	}
	if (element.matches(selector)) {
		return element;
	}
	if (element === lastParent) {
		return null;
	}
	return matchPath(element.parentElement, selector, lastParent);
}
let on = function (type, selector, listener, options) {
	let events = this._EVENTS;
	if (!events) {
		events = {};
		this._EVENTS = events;
	}
	let elementEvents = events[type];
	if (!elementEvents) {
		elementEvents = [];
		events[type] = elementEvents;
	}
	let callback = function (ev) {
		let delegateTarget = matchPath(ev.target, selector, ev.currentTarget);
		if (delegateTarget) {
			listener.call(this, ev, delegateTarget);
		}
	};
	elementEvents.push({ selector, listener, options, callback });
	this.addEventListener(type, callback, options);
};
let off = function (type, selector, listener, options) {
	let events = this._EVENTS;
	if (!events) {
		return;
	}
	let elementEvents = events[type];
	if (!elementEvents) {
		return;
	}
	events[type] = elementEvents.filter((event) => {
		if (event.selector === selector &&
			event.listener === listener &&
			event.options === options) {
			let callback = event.callback;
			this.removeEventListener(type, callback, options);
			return false;
		}
		return true;
	});
};
HTMLElement.prototype.on = on;
Document.prototype.on = on;
HTMLElement.prototype.off = off;
Document.prototype.off = off;
function ajax(options) {
	let { method, url, success, error, data, withCredentials } = options;
	method = method || 'GET';
	if (withCredentials === undefined) {
		withCredentials = true;
	}
	let request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onload = () => {
		let status = request.status;
		let resp = request.response;
		try {
			resp = JSON.parse(resp);
		} catch(e) {}
		if (status >= 200 && status < 400) {
			success && success(resp, request);
		}
		else {
			error && error(resp, request);
		}
	};
	request.onerror = (err) => {
		error && error(err, request);
	};

	request.withCredentials = withCredentials;
	if (data) {
		request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		request.send(JSON.stringify(data));
	}
	else {
		request.send();
	}
}
function ajaxPromise(options) {
	return new Promise((resolve, reject) => {
		options.success = resolve;
		options.error = (resp, request) => reject(request);
		ajax(options);
	});
}
window.ajax = ajax;
window.ajaxPromise = ajaxPromise;
function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}
window.ready = ready;
