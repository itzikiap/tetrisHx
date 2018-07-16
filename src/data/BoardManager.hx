package data;
import data.MatrixArray;

/**
 * THis class manage all the managing of the game board matrixes.
 * @author IAP
 */
class BoardManager
{
	public var mainMatrix:MatrixArray;
	public var nextBlock:MatrixArray;
	public var thisBlock:MatrixArray;

	var position:Point;

	public function new()
	{
		clearBoard();
	}

	/**
	 * Copy the next block  display to the current, so it will be active,
	 * and Generates the next block to display as "next" .
	 */
	public function generateNextBlock() {
		thisBlock = nextBlock;
		var block = BlocksDef.blockTypes[Std.random(BlocksDef.blockTypes.length)];
		nextBlock = new MatrixArray(block[1], block[0][0], block[0][1]);
		position = new Point(Math.round(mainMatrix.width / 2 - 1), -1);
	}

	/**
	 * check if a certain movement of the block will result in coliding with the walls or
	 * another block that was baked on the main board
	 * The movement itself is not permanant and is made only for the check
	 * @param	x	the movemnt to perform for the check in the x axis.
	 * @param	y	the movemnt to perform for the check in the y axis
	 */
	public inline function checkMovement(x:Int = 0, y:Int = 0):Bool {
		var hit = checkHit(thisBlock, position.move(x, y));
		var boundryx = (position.x+x < 0) || (position.x+x > mainMatrix.width - thisBlock.width);
		var boundryy = (position.y+y < 0) || (position.y+y > mainMatrix.height- thisBlock.height);
		return !(hit || boundryx || boundryy);
	}

	/**
	 * Get a board action to perform, like move or rotate,
	 * and do it.
	 * It perform a validity check before the movement.
	 * it DOESN'T perform validity check on rotation
	 * @param	action	The action to perform
	 */
	public function performAction(action:BoardAction):Void {
		switch action {
			case Left     :{
				if (checkMovement(-1)) {
					position = position.move(-1);
				}
			};
			case Right    :{
				if (checkMovement(1)) {
					position = position.move(1);
				}
			};
			case Down     :{
				if (checkMovement(0, 1)) {
					position = position.move(0, 1);
				}
			};
			case Rotate:{
				if (!checkHit(rotateBlock(thisBlock))) {
					thisBlock = rotateBlock(thisBlock);
				}
			};
		}
	}

	/**
	 * Take the current block and copy it to the main board in it's current position
	 * This change is permanant.
	 */
	public function bakeCompositeMatrix() {
		mainMatrix = getCompositeMatrix();
	}

	/**
	 * get a representation of the main board and the block in it's current position.
	 * This will not change the main board, but rather create a cop of it.
	 * @return	a copy of the main board
	 */
	public function getCompositeMatrix():MatrixArray {
		return mainMatrix.addSegment(position.x, position.y, thisBlock);
	}

	/**
	 * checks to see which row in the main matrix are full,
	 * in the sence that there are no empty blocks
	 * @return	an array of the found indexes, or an empty array
	 */
	public function checkFullRow():Array<Int> {
		var a:Array<Int> = [];
		for (r in 0...mainMatrix.height) {
			var isFullx = true;
			for (c in 0...mainMatrix.width) {
				isFullx = isFullx && (mainMatrix.getCell(c, r) > 0);
			}
			if (isFullx) a.push(r);
		}
		return a;
	}

	/**
	 * removes a list of width from the main matrix
	 * @param	a	the list of width to remove
	 */
	public function removeRows(a:Array<Int>) {
		a.sort(function (a, b):Int {
			  if (a < b) return -1;
			  else if (a > b) return 1;
			  return 0;
			});

		for (i in 0...a.length) {
			mainMatrix.removeRow(a[i]);
			mainMatrix.unshiftRow([for (i in 0...mainMatrix.width) 0]);
		}
	}

	/**
	 * clears the board and the blocks
	 */
	public function clearBoard() {
		var p = Constants.BOARD_DIMENTIONS;
		mainMatrix = new MatrixArray([for (i in 0...p.x * (p.y)) 0], p.x, p.y);
		thisBlock = new MatrixArray([for (i in 0...3 * 3) 0], 3, 3);
		nextBlock = new MatrixArray([for (i in 0...3 * 3) 0], 3, 3);
	}

	/**
	 * get access to the current block
	 */
	public function getCurrentBlock():MatrixArray {
		return thisBlock.copy();
	}

	/**
	 * get access of the next block on display
	 */
	public function getNextBlock():MatrixArray {
		return nextBlock.copy();
	}

	/**
	 * Checks if a block with a given position
	 * If block and position are not supplied, the function will use the default
	 * "thisBlock" and current position
	 * @param	block	the block to check for
	 * @param	pos
	 * @return
	 */
	private function checkHit(?block:MatrixArray, ?pos:Point):Bool {
		if (block == null) block = thisBlock;
		if (pos   == null) pos   = position;
		for (i in 0...block.width) {
			for (j in 0...block.height) {
				if (block.getCell(i,j) > 0 && mainMatrix.getCell(i + pos.x, j + pos.y) > 0) return true;
			}
		}
		return false;
	}

	/**
	 * Rotates the givn matrix by 90 degrees
	 * @param	matrix	The matrix to rotate
	 * @return	the rotated matrix
	 */
	private function rotateBlock(matrix:MatrixArray):MatrixArray {
		var a = new MatrixArray(matrix.getRawArray(), matrix.height, matrix.width);

		for (x in 0...matrix.width) {
			for (y in 0...matrix.height) {
				a.putCell(  y,matrix.width -  x-1, matrix.getCell(x,y));
			}
		}

		return a;
	}
}

/**
 * A helper class to keep a point data.
 */
class Point {
	public var x : Int;
	public var y : Int;

	public function new (x:Int = 0, y:Int = 0)
	{
		this.x = x;
		this.y = y;

	}

	/**
	 * creates a copy of the point, translated with the given offset
	 * @param	x	The horizontal movement
	 * @param	y	The vertical movement
	 * @return	a new, moved point
	 */
	public inline function move(x:Int = 0, y:Int = 0):Point {
		return new Point(this.x + x, this.y + y);
	}
}

enum BoardAction {
	Left;
	Right;
	Down;
	Rotate;
}


/**
 * Definitions for common blocks configurations
 */
class BlocksDef
{
	static var type0 =  [[2, 3],
						[1, 1,
						 0, 1,
						 0, 1]];
	static var type1 =  [[2, 3],
						[2, 2,
						 2, 0,
						 2, 0]];
	static var type2 =  [[3, 2],
						[3, 3, 3,
						 0, 3, 0]];
	static var type3 =  [[3, 2],
						[0, 4, 4,
						 4, 4, 0]];
	static var type4 =  [[3, 2],
						[5, 5, 0,
						 0, 5, 5]];
	static var type5 =  [[2, 2],
						[6, 6,
						 6, 6]];
	static var type6 =  [[1, 4],
						[8,
						 8,
						 8,
						 8]];


	/**
	 * A public array of the blocks.
	 * A block can be selected randomly using array length
	 */
	public static var blockTypes = [type0, type1, type2, type3, type4, type5, type6];
}
