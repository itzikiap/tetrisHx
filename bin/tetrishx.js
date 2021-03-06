// Generated by Haxe 3.4.2 (git build development @ e033003)
(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var GameEngine = function() {
	this.initialized = false;
};
GameEngine.__name__ = true;
GameEngine.prototype = {
	init: function() {
		var _gthis = this;
		if(this.initialized) {
			return;
		}
		this.initialized = true;
		this.output = new display_JSRenderer();
		this.input = new logic_JSKeyboardActions();
		this.actions = logic_GameActions.get_instance();
		this.board = new data_BoardManager();
		this.input.init();
		this.actions.actions.get(logic_Actions.MoveRight).add(function() {
			_gthis.performBoardAction(data_BoardAction.Right);
		});
		this.actions.actions.get(logic_Actions.MoveLeft).add(function() {
			_gthis.performBoardAction(data_BoardAction.Left);
		});
		this.actions.actions.get(logic_Actions.MoveDown).add(function() {
			_gthis.performBoardAction(data_BoardAction.Down);
		});
		this.actions.actions.get(logic_Actions.RotateLeft).add(function() {
			_gthis.performBoardAction(data_BoardAction.Rotate);
		});
		this.actions.actions.get(logic_Actions.GameStep).add(function() {
			_gthis.performGameStep();
		});
		this.actions.actions.get(logic_Actions.StartGame).add(function() {
			_gthis.startGame();
		});
		this.actions.actions.get(logic_Actions.EndGame).add(function() {
			_gthis.endGame();
		});
	}
	,startGame: function() {
		this.output.init();
		this.board.clearBoard();
		this.board.generateNextBlock();
		this.board.generateNextBlock();
		this.resetScore();
		if(this.gameStepTimer != null) {
			this.gameStepTimer.stop();
		}
		this.gameStepTimer = new haxe_Timer(data_Constants.GAME_STEP_INTERVAL);
		var tmp = this.actions.actions.get(logic_Actions.GameStep);
		this.gameStepTimer.run = $bind(tmp,tmp.dispatch);
	}
	,endGame: function() {
		if(this.gameStepTimer != null) {
			this.gameStepTimer.stop();
		}
		haxe_Timer.delay(($_=this.actions.actions.get(logic_Actions.StartGame),$bind($_,$_.dispatch)),2000);
	}
	,performGameStep: function() {
		var _this = this.board;
		var _this1 = _this.position;
		var hit = _this.checkHit(_this.thisBlock,new data_Point(_this1.x,_this1.y + 1));
		var boundryx = _this.position.x < 0 || _this.position.x > _this.mainMatrix[0] - _this.thisBlock[0];
		var boundryy = _this.position.y + 1 < 0 || _this.position.y + 1 > _this.mainMatrix[1] - _this.thisBlock[1];
		if(!(!(hit || boundryx || boundryy))) {
			this.board.bakeCompositeMatrix();
			this.board.generateNextBlock();
			var a = this.board.checkFullRow();
			this.board.removeRows(a);
			this.updateScore(a.length);
			var _this2 = this.board;
			var _this3 = _this2.position;
			var hit1 = _this2.checkHit(_this2.thisBlock,new data_Point(_this3.x,_this3.y + 1));
			var boundryx1 = _this2.position.x < 0 || _this2.position.x > _this2.mainMatrix[0] - _this2.thisBlock[0];
			var boundryy1 = _this2.position.y + 1 < 0 || _this2.position.y + 1 > _this2.mainMatrix[1] - _this2.thisBlock[1];
			if(!(!(hit1 || boundryx1 || boundryy1))) {
				this.actions.actions.get(logic_Actions.EndGame).dispatch();
			}
			data_Constants.GAME_STEP_INTERVAL -= a.length;
			data_Constants.GAME_STEP_INTERVAL = Math.max(data_Constants.GAME_STEP_INTERVAL,10);
			this.refreshBoard();
		} else {
			this.performBoardAction(data_BoardAction.Down);
		}
	}
	,resetScore: function() {
		this.score = 0;
	}
	,updateScore: function(rows) {
		this.score += Math.round(rows * rows * 1.2);
	}
	,performBoardAction: function(action) {
		this.board.performAction(action);
		this.refreshBoard();
	}
	,refreshBoard: function() {
		this.output.render(this.board.getCompositeMatrix(),this.board.getNextBlock(),this.score);
	}
};
var Main = function() {
	this.game = new GameEngine();
	this.game.init();
	logic_GameActions.get_instance().actions.get(logic_Actions.StartGame).dispatch();
};
Main.__name__ = true;
Main.main = function() {
	var main = new Main();
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var data_BoardManager = function() {
	this.clearBoard();
};
data_BoardManager.__name__ = true;
data_BoardManager.prototype = {
	generateNextBlock: function() {
		this.thisBlock = this.nextBlock;
		var block = data_BlocksDef.blockTypes[Std.random(data_BlocksDef.blockTypes.length)];
		var this1 = [block[0][0],block[0][1]].concat(block[1]);
		this.nextBlock = this1;
		this.position = new data_Point(Math.round(this.mainMatrix[0] / 2 - 1),-1);
	}
	,checkMovement: function(x,y) {
		if(y == null) {
			y = 0;
		}
		if(x == null) {
			x = 0;
		}
		var _this = this.position;
		var hit = this.checkHit(this.thisBlock,new data_Point(_this.x + x,_this.y + y));
		var boundryx = this.position.x + x < 0 || this.position.x + x > this.mainMatrix[0] - this.thisBlock[0];
		var boundryy = this.position.y + y < 0 || this.position.y + y > this.mainMatrix[1] - this.thisBlock[1];
		return !(hit || boundryx || boundryy);
	}
	,performAction: function(action) {
		switch(action[1]) {
		case 0:
			var _this = this.position;
			var hit = this.checkHit(this.thisBlock,new data_Point(_this.x + -1,_this.y));
			var boundryx = this.position.x + -1 < 0 || this.position.x + -1 > this.mainMatrix[0] - this.thisBlock[0];
			var boundryy = this.position.y < 0 || this.position.y > this.mainMatrix[1] - this.thisBlock[1];
			if(!(hit || boundryx || boundryy)) {
				var _this1 = this.position;
				this.position = new data_Point(_this1.x + -1,_this1.y);
			}
			break;
		case 1:
			var _this2 = this.position;
			var hit1 = this.checkHit(this.thisBlock,new data_Point(_this2.x + 1,_this2.y));
			var boundryx1 = this.position.x + 1 < 0 || this.position.x + 1 > this.mainMatrix[0] - this.thisBlock[0];
			var boundryy1 = this.position.y < 0 || this.position.y > this.mainMatrix[1] - this.thisBlock[1];
			if(!(hit1 || boundryx1 || boundryy1)) {
				var _this3 = this.position;
				this.position = new data_Point(_this3.x + 1,_this3.y);
			}
			break;
		case 2:
			var _this4 = this.position;
			var hit2 = this.checkHit(this.thisBlock,new data_Point(_this4.x,_this4.y + 1));
			var boundryx2 = this.position.x < 0 || this.position.x > this.mainMatrix[0] - this.thisBlock[0];
			var boundryy2 = this.position.y + 1 < 0 || this.position.y + 1 > this.mainMatrix[1] - this.thisBlock[1];
			if(!(hit2 || boundryx2 || boundryy2)) {
				var _this5 = this.position;
				this.position = new data_Point(_this5.x,_this5.y + 1);
			}
			break;
		case 3:
			if(!this.checkHit(this.rotateBlock(this.thisBlock))) {
				this.thisBlock = this.rotateBlock(this.thisBlock);
			}
			break;
		}
	}
	,bakeCompositeMatrix: function() {
		this.mainMatrix = this.getCompositeMatrix();
	}
	,getCompositeMatrix: function() {
		var this1 = this.mainMatrix;
		var x = this.position.x;
		var y = this.position.y;
		var matrix = this.thisBlock;
		var a = this1.slice(2);
		var this2 = [this1[0],this1[1]].concat(a);
		var a1 = this2;
		var _g1 = 0;
		var _g = matrix[0];
		while(_g1 < _g) {
			var r = _g1++;
			var _g3 = 0;
			var _g2 = matrix[1];
			while(_g3 < _g2) {
				var c = _g3++;
				if(matrix[c * matrix[0] + 2 + r] > 0) {
					a1[(y + c) * a1[0] + 2 + (x + r)] = matrix[c * matrix[0] + 2 + r];
				}
			}
		}
		return a1;
	}
	,checkFullRow: function() {
		var a = [];
		var _g1 = 0;
		var _g = this.mainMatrix[1];
		while(_g1 < _g) {
			var r = _g1++;
			var isFullx = true;
			var _g3 = 0;
			var _g2 = this.mainMatrix[0];
			while(_g3 < _g2) {
				var c = _g3++;
				if(isFullx) {
					var this1 = this.mainMatrix;
					isFullx = this1[r * this1[0] + 2 + c] > 0;
				} else {
					isFullx = false;
				}
			}
			if(isFullx) {
				a.push(r);
			}
		}
		return a;
	}
	,removeRows: function(a) {
		a.sort(function(a1,b) {
			if(a1 < b) {
				return -1;
			} else if(a1 > b) {
				return 1;
			}
			return 0;
		});
		var _g1 = 0;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			var this1 = this.mainMatrix;
			this1[1] -= 1;
			this1.splice(a[i] * this1[0] + 2,this1[0]);
			var _g2 = [];
			var _g4 = 0;
			var _g3 = this.mainMatrix[0];
			while(_g4 < _g3) {
				var i1 = _g4++;
				_g2.push(0);
			}
			var dims = this.mainMatrix.splice(0,2);
			dims[1] += 1;
			this.mainMatrix = dims.concat(_g2).concat(this.mainMatrix);
		}
	}
	,clearBoard: function() {
		var p = data_Constants.BOARD_DIMENTIONS;
		var _g = [];
		var _g2 = 0;
		var _g1 = p.x * p.y;
		while(_g2 < _g1) {
			var i = _g2++;
			_g.push(0);
		}
		var this1 = [p.x,p.y].concat(_g);
		this.mainMatrix = this1;
		var _g11 = [];
		var _g3 = 0;
		var _g21 = 9;
		while(_g3 < _g21) {
			var i1 = _g3++;
			_g11.push(0);
		}
		var this11 = [3,3].concat(_g11);
		this.thisBlock = this11;
		var _g22 = [];
		var _g4 = 0;
		var _g31 = 9;
		while(_g4 < _g31) {
			var i2 = _g4++;
			_g22.push(0);
		}
		var this12 = [3,3].concat(_g22);
		this.nextBlock = this12;
	}
	,getCurrentBlock: function() {
		var this1 = this.thisBlock;
		var a = this1.slice(2);
		var this2 = [this1[0],this1[1]].concat(a);
		return this2;
	}
	,getNextBlock: function() {
		var this1 = this.nextBlock;
		var a = this1.slice(2);
		var this2 = [this1[0],this1[1]].concat(a);
		return this2;
	}
	,checkHit: function(block,pos) {
		if(block == null) {
			block = this.thisBlock;
		}
		if(pos == null) {
			pos = this.position;
		}
		var _g1 = 0;
		var _g = block[0];
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = block[1];
			while(_g3 < _g2) {
				var j = _g3++;
				var tmp;
				if(block[j * block[0] + 2 + i] > 0) {
					var this1 = this.mainMatrix;
					tmp = this1[(j + pos.y) * this1[0] + 2 + (i + pos.x)] > 0;
				} else {
					tmp = false;
				}
				if(tmp) {
					return true;
				}
			}
		}
		return false;
	}
	,rotateBlock: function(matrix) {
		var a = matrix.slice(2);
		var this1 = [matrix[1],matrix[0]].concat(a);
		var a1 = this1;
		var _g1 = 0;
		var _g = matrix[0];
		while(_g1 < _g) {
			var x = _g1++;
			var _g3 = 0;
			var _g2 = matrix[1];
			while(_g3 < _g2) {
				var y = _g3++;
				a1[(matrix[0] - x - 1) * a1[0] + 2 + y] = matrix[y * matrix[0] + 2 + x];
			}
		}
		return a1;
	}
};
var data_Point = function(x,y) {
	if(y == null) {
		y = 0;
	}
	if(x == null) {
		x = 0;
	}
	this.x = x;
	this.y = y;
};
data_Point.__name__ = true;
data_Point.prototype = {
	move: function(x,y) {
		if(y == null) {
			y = 0;
		}
		if(x == null) {
			x = 0;
		}
		return new data_Point(this.x + x,this.y + y);
	}
};
var data_BoardAction = { __ename__ : true, __constructs__ : ["Left","Right","Down","Rotate"] };
data_BoardAction.Left = ["Left",0];
data_BoardAction.Left.__enum__ = data_BoardAction;
data_BoardAction.Right = ["Right",1];
data_BoardAction.Right.__enum__ = data_BoardAction;
data_BoardAction.Down = ["Down",2];
data_BoardAction.Down.__enum__ = data_BoardAction;
data_BoardAction.Rotate = ["Rotate",3];
data_BoardAction.Rotate.__enum__ = data_BoardAction;
data_BoardAction.__empty_constructs__ = [data_BoardAction.Left,data_BoardAction.Right,data_BoardAction.Down,data_BoardAction.Rotate];
var data_BlocksDef = function() { };
data_BlocksDef.__name__ = true;
var data_Constants = function() {
};
data_Constants.__name__ = true;
var data__$MatrixArray_MatrixArray_$Impl_$ = {};
data__$MatrixArray_MatrixArray_$Impl_$.__name__ = true;
data__$MatrixArray_MatrixArray_$Impl_$._new = function(a,width,height) {
	var this1 = [width,height].concat(a);
	return this1;
};
data__$MatrixArray_MatrixArray_$Impl_$.copy = function(this1) {
	var a = this1.slice(2);
	var this2 = [this1[0],this1[1]].concat(a);
	return this2;
};
data__$MatrixArray_MatrixArray_$Impl_$.getRawArray = function(this1) {
	return this1.slice(2);
};
data__$MatrixArray_MatrixArray_$Impl_$.removeRow = function(this1,rowNum) {
	this1[1] -= 1;
	return this1.splice(rowNum * this1[0] + 2,this1[0]);
};
data__$MatrixArray_MatrixArray_$Impl_$.getRowNum = function(this1,rowNum) {
	return rowNum * this1[0] + 2;
};
data__$MatrixArray_MatrixArray_$Impl_$.unshiftRow = function(this1,a) {
	var dims = this1.splice(0,2);
	dims[1] += 1;
	this1 = dims.concat(a).concat(this1);
};
data__$MatrixArray_MatrixArray_$Impl_$.addSegment = function(this1,x,y,matrix) {
	var a = this1.slice(2);
	var this2 = [this1[0],this1[1]].concat(a);
	var a1 = this2;
	var _g1 = 0;
	var _g = matrix[0];
	while(_g1 < _g) {
		var r = _g1++;
		var _g3 = 0;
		var _g2 = matrix[1];
		while(_g3 < _g2) {
			var c = _g3++;
			if(matrix[c * matrix[0] + 2 + r] > 0) {
				a1[(y + c) * a1[0] + 2 + (x + r)] = matrix[c * matrix[0] + 2 + r];
			}
		}
	}
	return a1;
};
data__$MatrixArray_MatrixArray_$Impl_$.get_length = function(this1) {
	return this1.length - 2;
};
data__$MatrixArray_MatrixArray_$Impl_$.get_width = function(this1) {
	return this1[0];
};
data__$MatrixArray_MatrixArray_$Impl_$.get_height = function(this1) {
	return this1[1];
};
data__$MatrixArray_MatrixArray_$Impl_$.putCell = function(this1,x,y,value) {
	this1[y * this1[0] + 2 + x] = value;
};
data__$MatrixArray_MatrixArray_$Impl_$.putCellByIndex = function(this1,index,value) {
	this1[index] = value;
};
data__$MatrixArray_MatrixArray_$Impl_$.getCell = function(this1,x,y) {
	return this1[y * this1[0] + 2 + x];
};
data__$MatrixArray_MatrixArray_$Impl_$.getCellByIndex = function(this1,index) {
	return this1[index];
};
data__$MatrixArray_MatrixArray_$Impl_$.getIndex = function(this1,x,y) {
	return y * this1[0] + 2 + x;
};
data__$MatrixArray_MatrixArray_$Impl_$.getRow = function(this1,rowNum) {
	return this1.slice(rowNum * this1[0] + 2,this1[0]);
};
data__$MatrixArray_MatrixArray_$Impl_$.getPartRow = function(this1,rowNum,offset,len) {
	return this1.slice(rowNum * this1[0] + 2 + offset,len);
};
data__$MatrixArray_MatrixArray_$Impl_$.getSection = function(this1,x,y,width,height) {
	var a = [];
	var _g1 = 1;
	var _g = height;
	while(_g1 < _g) {
		var i = _g1++;
		a = a.concat(this1.slice(x * this1[0] + 2 + y,width));
	}
	var this2 = [width,height].concat(a);
	return this2;
};
var display_JSRenderer = function() {
	var _gthis = this;
	logic_GameActions.get_instance().actions.get(logic_Actions.EndGame).add(function() {
		var _gthis1 = _gthis.blankBlock;
		var tmp = _gthis.blockCanvas.getContext("2d",null);
		_gthis.drawMatrix(_gthis1,tmp);
	});
	var _g = [];
	var _g2 = 0;
	var _g1 = 16;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push(0);
	}
	var this1 = [4,4].concat(_g);
	this.blankBlock = this1;
};
display_JSRenderer.__name__ = true;
display_JSRenderer.prototype = {
	init: function() {
		if(this.boardCanvas == null) {
			this.boardCanvas = this.createCanvasElement(data_Constants.BOARD_DIMENTIONS.x * 20,data_Constants.BOARD_DIMENTIONS.y * 20);
		}
		if(this.blockCanvas == null) {
			this.blockCanvas = this.createCanvasElement(80,80);
		}
		if(this.score == null) {
			this.score = window.document.body.appendChild(window.document.createElement("pre"));
		}
	}
	,createCanvasElement: function(width,height) {
		var canvas = window.document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		window.document.body.appendChild(canvas);
		return canvas;
	}
	,drawMatrix: function(blockMatrix,ctx) {
		var _g1 = 0;
		var _g = blockMatrix[0];
		while(_g1 < _g) {
			var r = _g1++;
			var _g3 = 0;
			var _g2 = blockMatrix[1];
			while(_g3 < _g2) {
				var c = _g3++;
				ctx.fillStyle = data_Constants.COLORS[blockMatrix[c * blockMatrix[0] + 2 + r]];
				var wid = 20;
				ctx.fillRect(r * wid,c * wid,wid,wid);
			}
		}
	}
	,render: function(compositeMatrix,nextBlock,score) {
		var _gthis = this;
		window.requestAnimationFrame(function(time) {
			var tmp = _gthis.boardCanvas.getContext("2d",null);
			_gthis.drawMatrix(compositeMatrix,tmp);
			var _gthis1 = _gthis.blankBlock;
			var tmp1 = _gthis.blockCanvas.getContext("2d",null);
			_gthis.drawMatrix(_gthis1,tmp1);
			var tmp2 = _gthis.blockCanvas.getContext("2d",null);
			_gthis.drawMatrix(nextBlock,tmp2);
			_gthis.score.textContent = "Score: " + score;
		});
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var haxe_ds_BalancedTree = function() {
};
haxe_ds_BalancedTree.__name__ = true;
haxe_ds_BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	,setLoop: function(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		var c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,balance: function(l,k,v,r) {
		var hl = l == null ? 0 : l._height;
		var hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			var _this = l.left;
			var _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			var _this2 = r.right;
			var _this3 = r.left;
			if((_this2 == null ? 0 : _this2._height) > (_this3 == null ? 0 : _this3._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) {
		h = -1;
	}
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) {
		var tmp;
		var _this = this.left;
		var _this1 = this.right;
		if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
			var _this2 = this.left;
			if(_this2 == null) {
				tmp = 0;
			} else {
				tmp = _this2._height;
			}
		} else {
			var _this3 = this.right;
			if(_this3 == null) {
				tmp = 0;
			} else {
				tmp = _this3._height;
			}
		}
		this._height = tmp + 1;
	} else {
		this._height = h;
	}
};
haxe_ds_TreeNode.__name__ = true;
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
haxe_ds_EnumValueMap.__name__ = true;
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) {
			return d;
		}
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
});
var interfaces_IRenderer = function() { };
interfaces_IRenderer.__name__ = true;
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var logic_GameActions = function() {
	this.actions = new haxe_ds_EnumValueMap();
	var _g = 0;
	var _g1 = logic_Actions.__empty_constructs__;
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		var this1 = this.actions;
		var v = new msignal_Signal0();
		this1.set(i,v);
	}
};
logic_GameActions.__name__ = true;
logic_GameActions.get_instance = function() {
	if(logic_GameActions._instance == null) {
		logic_GameActions._instance = new logic_GameActions();
	}
	return logic_GameActions._instance;
};
var logic_Actions = { __ename__ : true, __constructs__ : ["RotateLeft","RotateRight","MoveLeft","MoveRight","MoveDown","StartGame","EndGame","GameStep"] };
logic_Actions.RotateLeft = ["RotateLeft",0];
logic_Actions.RotateLeft.__enum__ = logic_Actions;
logic_Actions.RotateRight = ["RotateRight",1];
logic_Actions.RotateRight.__enum__ = logic_Actions;
logic_Actions.MoveLeft = ["MoveLeft",2];
logic_Actions.MoveLeft.__enum__ = logic_Actions;
logic_Actions.MoveRight = ["MoveRight",3];
logic_Actions.MoveRight.__enum__ = logic_Actions;
logic_Actions.MoveDown = ["MoveDown",4];
logic_Actions.MoveDown.__enum__ = logic_Actions;
logic_Actions.StartGame = ["StartGame",5];
logic_Actions.StartGame.__enum__ = logic_Actions;
logic_Actions.EndGame = ["EndGame",6];
logic_Actions.EndGame.__enum__ = logic_Actions;
logic_Actions.GameStep = ["GameStep",7];
logic_Actions.GameStep.__enum__ = logic_Actions;
logic_Actions.__empty_constructs__ = [logic_Actions.RotateLeft,logic_Actions.RotateRight,logic_Actions.MoveLeft,logic_Actions.MoveRight,logic_Actions.MoveDown,logic_Actions.StartGame,logic_Actions.EndGame,logic_Actions.GameStep];
var logic_JSKeyboardActions = function() {
};
logic_JSKeyboardActions.__name__ = true;
logic_JSKeyboardActions.prototype = {
	init: function() {
		window.document.addEventListener("keydown",$bind(this,this.handleKeyboard));
		window.document.body.focus();
	}
	,handleKeyboard: function(ev) {
		var prevent = true;
		var _g = ev.keyCode;
		switch(_g) {
		case 37:
			logic_GameActions.get_instance().actions.get(logic_Actions.MoveLeft).dispatch();
			break;
		case 38:
			logic_GameActions.get_instance().actions.get(logic_Actions.RotateLeft).dispatch();
			break;
		case 39:
			logic_GameActions.get_instance().actions.get(logic_Actions.MoveRight).dispatch();
			break;
		case 40:
			logic_GameActions.get_instance().actions.get(logic_Actions.MoveDown).dispatch();
			break;
		default:
			prevent = false;
		}
		if(prevent) {
			ev.preventDefault();
		}
	}
};
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) {
		valueClasses = [];
	}
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = true;
msignal_Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) {
			priority = 0;
		}
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) {
			return null;
		}
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(once == null) {
			once = false;
		}
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) {
				this.priorityBased = true;
			}
			if(!this.priorityBased && priority == 0) {
				this.slots = this.slots.prepend(newSlot);
			} else {
				this.slots = this.slots.insertWithPriority(newSlot);
			}
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) {
			return true;
		}
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) {
			return true;
		}
		if(existingSlot.once != once) {
			throw new js__$Boot_HaxeError("You cannot addOnce() then add() the same listener without removing the relationship first.");
		}
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(once == null) {
			once = false;
		}
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = true;
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(once == null) {
			once = false;
		}
		return new msignal_Slot0(this,listener,once,priority);
	}
});
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = true;
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(once == null) {
			once = false;
		}
		return new msignal_Slot1(this,listener,once,priority);
	}
});
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = true;
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) {
			priority = 0;
		}
		if(once == null) {
			once = false;
		}
		return new msignal_Slot2(this,listener,once,priority);
	}
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) {
		priority = 0;
	}
	if(once == null) {
		once = false;
	}
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = true;
msignal_Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) {
			throw new js__$Boot_HaxeError("listener cannot be null");
		}
		return this.listener = value;
	}
};
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) {
		priority = 0;
	}
	if(once == null) {
		once = false;
	}
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = true;
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) {
			return;
		}
		if(this.once) {
			this.remove();
		}
		this.listener();
	}
});
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) {
		priority = 0;
	}
	if(once == null) {
		once = false;
	}
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = true;
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) {
			return;
		}
		if(this.once) {
			this.remove();
		}
		if(this.param != null) {
			value1 = this.param;
		}
		this.listener(value1);
	}
});
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) {
		priority = 0;
	}
	if(once == null) {
		once = false;
	}
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = true;
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) {
			return;
		}
		if(this.once) {
			this.remove();
		}
		if(this.param1 != null) {
			value1 = this.param1;
		}
		if(this.param2 != null) {
			value2 = this.param2;
		}
		this.listener(value1,value2);
	}
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal_SlotList.NIL != null) {
			throw new js__$Boot_HaxeError("Parameters head and tail are null. Use the NIL element instead.");
		}
		this.nonEmpty = false;
	} else if(head == null) {
		throw new js__$Boot_HaxeError("Parameter head cannot be null.");
	} else {
		this.head = head;
		this.tail = tail == null ? msignal_SlotList.NIL : tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = true;
msignal_SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) {
			return 0;
		}
		if(this.tail == msignal_SlotList.NIL) {
			return 1;
		}
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) {
			return this;
		}
		if(!this.nonEmpty) {
			return new msignal_SlotList(slot);
		}
		if(this.tail == msignal_SlotList.NIL) {
			return new msignal_SlotList(slot).prepend(this.head);
		}
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) {
			return new msignal_SlotList(slot);
		}
		var priority = slot.priority;
		if(priority >= this.head.priority) {
			return this.prepend(slot);
		}
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) {
			return this;
		}
		if(Reflect.compareMethods(this.head.listener,listener)) {
			return this.tail;
		}
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) {
			return false;
		}
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) {
				return true;
			}
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) {
			return null;
		}
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) {
				return p.head;
			}
			p = p.tail;
		}
		return null;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
msignal_SlotList.NIL = new msignal_SlotList(null,null);
data_BlocksDef.type0 = [[2,3],[1,1,0,1,0,1]];
data_BlocksDef.type1 = [[2,3],[2,2,2,0,2,0]];
data_BlocksDef.type2 = [[3,2],[3,3,3,0,3,0]];
data_BlocksDef.type3 = [[3,2],[0,4,4,4,4,0]];
data_BlocksDef.type4 = [[3,2],[5,5,0,0,5,5]];
data_BlocksDef.type5 = [[2,2],[6,6,6,6]];
data_BlocksDef.type6 = [[1,4],[8,8,8,8]];
data_BlocksDef.blockTypes = [data_BlocksDef.type0,data_BlocksDef.type1,data_BlocksDef.type2,data_BlocksDef.type3,data_BlocksDef.type4,data_BlocksDef.type5,data_BlocksDef.type6];
data_Constants.CELL_WIDTH = 20;
data_Constants.GAME_STEP_INTERVAL = 500;
data_Constants.BOARD_DIMENTIONS = { x : 10, y : 20};
data_Constants.COLORS = ["#000000","#0000AA","#00AA00","#00AAAA","#AA0000","#AA00AA","#AA5500","#AAAAAA","#555555","#5555FF","#55FF55","#55FFFF","#FF5555","#FF55FF","#FFFF55","#FFFFFF"];
Main.main();
})();

//# sourceMappingURL=tetris4docler.js.map