## 源码

	(function() {
	  var initializing = false,
	      // 判断函数是否可以序列化
	      superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	
	  Object.subClass = function(properties) {
	    var _super = this.prototype;
	
	    // 初始化超类
	    initializing = true;
	    var proto = new this();
	    initializing = false;
	
	    for (var name in properties) {
	      proto[name] = typeof properties[name] === 'function'
	                    && typeof _super[name] === 'function'
	                    && superPattern.test(properties[name]) 
	                    ? (function(name, fn) {
	                      return function() {
	                        var tmp = this._super;
	
	                        this._super = _super[name];
	
	                        var ret = fn.apply(this, arguments);
	                        this._super = tmp;
	
	                        return ret;
	                      };
	                    })(name, properties[name])
	                    : properties[name];
	    }
	
	    // 仿真类构造器
	    function Class() {
	      if (!initializing && this.init) {
	        this.init.apply(this, arguments);
	      }
	    }
	
	    // 设置类的原型
	    Class.prototype = proto;
	    // 重载构造器的引用
	    Class.constructor = Class;
	    // 让类继续可扩展
	    Class.subClass = arguments.callee;
	
	    return Class;
	
	  };
	})();



## 解析

### 函数序列化

函数序列化(function serialization) 就是简单接收一个函数，然后返回该函数的源码文本。

	/xyz/.test(function() { xyz; })
	
上述表达式创建一个包含 `xyz` 的函数，将该函数传递给正则表达式的 `test()` 方法，该正则表达式对 `xyz` 进行测试。如果函数能够正常序列化( `test()` 方法将接收一个字符串，然后出发函数的 `toString()` 方法)，最终结果将返回 `true`。