/**
 * @file util.js
 * @author zchen9(zhao.zchen9@gmail.com)
 */

(function(global) {

  function Util() {

    var queue = [], paused = false, results;

    this.isArray = function(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    };

    this.isFunction = function(fn) {
      return Object.prototype.toString.call(fn) === '[object Function]';
    }

    this.clone = function cloneObj(src) {
      var temp = this.isArray(src) ? [] : {};
      for (var i in src) {
        if (src.hasOwnProperty(i)) {
          temp[i] = typeof src[i] === "object" ? cloneObj(src[i]) : src[i];
        }
      }
      return temp;
    }

    this.uniqArray = function(arr) {
      if (!this.isArray(arr)) return;
      var temp = [],
          len = arr.length;
      arr.sort();
      for (var i = 0; i < len; i++) {
        if (arr[i] !== arr[i + 1]) {
          temp.push(arr[i]);
        }
      }
      return temp;
    }

    this.trim = function(str) {
      return str.replace(/\s+/g, '');
    }

    this.each = function(arr, fn) {
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        fn.call(fn[i], i);
      }
    }

    this.getObjectLength = function(obj) {
      return Object.keys(obj).length;
    }


    this.isEmail = function(emailStr){
      var emReg = /^([a-zA-Z0-9\_\-\.])+@([a-zA-Z0-9\_\-\.])+([a-zA-Z0-9]){2,4}$/gi;
      return emReg.test(emailStr);
    }

    this.isMobilePhone = function(phone){
      var phoneReg = /^\d{11}$/g;
      return phoneReg.test(phone + '');
    }

    this.hasClass = function(elem, className) {
      var originClass = elem.getAttribute('class'),
          res = false;
      if (originClass) {
        var names = originClass.split(' ');
        res = Array.prototype.some.call(names, function(val) {
          return val.indexOf(className) !== -1;
        });
      }
      return res;
    }

    this.addClass = function(elem, newClassName) {
      var className = elem.getAttribute('class');
      if (className && !this.hasClass(newClassName)) {
        elem.className += ' ' + newClassName;
      } else {
        elem.className = className || newClassName;
      }
    }

    this.removeClass = function(elem, oldClassName) {
      var className = elem.getAttribute('class');
      if (className && this.hasClass(oldClassName)) {
        className.replace(oldClassName, '');
      }
      elem.className = className;
    }

    this.isSiblingNode = function(elem, siblingNode){
      var nodes = elem.parentNode.childNodes,
          len = nodes.length;

      return Array.prototype.some.call(nodes, function(node) {
        return node === siblingNode;
      });
    }

    this.getPosition = function(elem) {
      var posRect = elem.getBoundingClientRect();
      var docTop = document.documentElement.clientTop;
      var docLeft = document.documentElement.clientLeft;

      return { 
        x: posRect.top - docTop,
        y: posRect.left - docLeft
      }
    }

    this.$ = function(selector) {
      return document.querySelectorAll(selector);
    }

    this.stopBubble = function(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    }

    this.stopDefault = function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
      }
    }

    this.$.on = function addEvent(elem, event, listener) {
      if (elem.addEventListener) {
        elem.addEventListener(event, listener, false);
      } else if (elem.attachment) {
        elem.attachment('on' + event, listener);
      } else {
        elem['on' + event] = listener;
      }
    }

    this.$.un = function removeEvent(elem, event, listener) {
      if (elem.removeEventListener) {
        elem.removeElementListener(event, listener, false);
      } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, listener);
      } else {
        elem['on' + event] = null;
      }
    }

    this.$.click = function addClickEvent(elem, listener) {
      this.$.on(elem, 'click', listener);
    }

    this.$.enter = function addEnterEvent(elem, listener) {
      var ev = event || window.event,
          curElem = ev.target || ev.srcElement,
          curKey = ev.keyCode || ev.which || ev.charCode;
      if (curElem === elem && +curKey === 13) {
        listener();
      }
    }

    this.$.delegate = function delegateEvent(elem, tag, event, listener) {
      var ev = event || window.event,
          elem = elem || document.body,
          child = elem.children,
          self = this;
      Array.prototype.forEach.call(child, function(node) {
        if (node.nodeName.toLowerCase() === tag.toLowerCase()) {
          self.$.on(node, event, listener);
        }
      });
    }

    this.isIE = function() {
      var ua = navigator.userAgent,
          idx = ua.indexOf('MSIE ');

      return idx !== -1 ? 'IE' + ua.substr(idx + 5, 1) : idx;
    }

    this.setCookie = function(name, val, expire) {
      var text = encodeURIComponent(name) + '=' + encodeURIComponent(val);
      if (expire instanceof Date) {
        text += '; expire=' + expire.toGMTString();
      }
      document.cookie = text;
    }

    this.getCookie = function(name) {
      var cookie = document.cookie,
          cookieName = encodeURIComponent(name) + '=',
          start = cookie.indexOf(cookieName),
          end = start !== -1 ? cookie.indexOf(';', start) : cookie.length;

      if (start === -1) return;

      return decodeURIComponent(cookie.substr(start + cookieName.length, end));

    }

    this.ajax = function(url, options) {

      var type = options.type || 'GET',
          data = options.data;

      options = {
        success: function(res, xhr) {
          console.log(res);
        },
        fail: function(res, xhr) {
          console.log('Request was unsuccessful: ' + xhr.status);
        }
      };

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if ( xhr.readyState == 4 ) {
          if ( ( xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            options.success(xhr.responseText, xhr);
          } else {
            options.fail(xhr.responseText, xhr);
          }
        }
      };

      function addURLParam(data) {
        var pair = [];
        if (data instanceof String) {
          data = encodeURIComponent(data);
        } else if (data instanceof Object) {
          Object.keys(data).forEach(function(item) {
            if (data.hasOwnProperty(item)) {
              pair.push(item + '=' + data[item].toString());
            }
          });
          data = encodeURIComponent(pair.join("&"));
        }
        return data;
      }

      if (type.toUpperCase() === "GET") {
        xhr.open("get", url += addURLParam(data || ''), false);
        xhr.send(null);
      } else if (type.toUpperCase() === "POST" ) {
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(addURLParam(data || ''));
      }
    }

  }

  this.log = function() {
    try {
      console.log.apply(console, arguments);
    } catch(e) {
      try {
        opera.postError.apply(opera, arguments);
      } catch(e) {
        alert(Array.prototype.join.call(arguments, ' '));
      }
    }
  }

  this.error = function() {
    try {
      console.error.apply(console, arguments);
    } catch(e) {
      try {
        JSTracker.error.apply(JSTracker, arguments);
      } catch(e) {
        alert(Array.prototype.join.call(arguments, ' '));
      }
    }
  }

  this.assert = function assert(value, desc) {
    (value) ? this.log(desc) : this.error(desc); 
  }

  this.paused = function() {
    paused = true;
  }

  this.resume = function() {
    paused = false;
    setTimeout(runTest, 1);
  }

  function runTest() {
    if (!paused && queue.length) {
      queue.shift()();
      if (!paused) {
        this.resume();
      }
    }
  }
  // 异步测试
  this.test = function(name, fn) {
    var self = this;
    queue.push(function() {
      results = self.assert(true, name);
      if (typeof fn === 'function') fn();
    });
  }
  
  global.Util = new Util();

})(window);
 