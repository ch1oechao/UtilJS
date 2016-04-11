## 单元测试

#### 日志记录

	function log() {
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
	
	function error() {
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
	
#### 测试用例

- 可重用性(repeatability) —— 测试结果应该是高度可再生的，多次运行测试应该产生相同的结果。
- 简单性(simplicity) —— 测试应该只专注于测试一件事。
- 独立性(independence) —— 测试用例应该独立运行，必须避免一个测试结果依赖于另外一个测试的结果。

#### 简单测试套件

	(function(){
	  
	  ...
	
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
	  
	  // Async
	  this.test = function(name, fn) {
	    var self = this;
	    queue.push(function() {
	      results = self.assert(true, name);
	      if (typeof fn === 'function') fn();
	    });
	    runTest();
	  }
	
	  ...
	  
	})();

#### 测试 demo

	  test('Async Test#1', function() {
	    paused();
	    setTimeout(function() {
	      assert(true, 'First test completed');
	      resume();
	    }, 1000);
	  });
	
	  test('Async Test#2', function() {
	    paused();
	    setTimeout(function() {
	      assert(true, 'Second test completed');
	      resume();
	    }, 1000);
	  });
