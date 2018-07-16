package data;

/**
 * This abstract attemps to save a 2d matrix in an array
 * First 2 cells are the dimentions of the matrix
 * It's my first fiddling with abstrats, so I kindda abused it to see how far I can go with it...
 * @author IAP
 */
abstract MatrixArray(Array<Int>)
{
	/**
	 * creates a new matrix with a given array and width and height definitions
	 * @param	a		The array witch will be the data of the matrix
	 * @param	width	Width of the matrix
	 * @param	height	Height of the matrix
	 */
	inline public function new (a:Array<Int>, width:Int, height:Int) {
		this = [width, height].concat(a);
	}

	/**
	 * Make a copy of the matrix
	 * @return	a MatrixArray
	 */
	inline public function copy():MatrixArray {
		return new MatrixArray(this.slice(2), width, height);
	}

	/**
	 * Return the current 1D array of the data,
	 * Without width and height definitions
	 * @return
	 */
	inline public function getRawArray():Array<Int> {
		return this.slice(2);
	}

	/**
	 * removes a row from the matrix
	 * @param	rowNum	The row number to remove
	 * @return	hthe array of the removed elements
	 */
	inline public function removeRow(rowNum:Int):Array<Int> {
		this[1] -= 1;
		return this.splice(getRowNum(rowNum), width);
	}

	/**
	 * Returns the index of the first element of a given row
	 * @param	rowNum	The row to check
	 * @return	the index of the first element of this row
	 */
	inline public function getRowNum(rowNum:Int):Int {
		return rowNum * width + 2;
	}

	/**
	 * unshift (Push from the start) an entire row to the matrix
	 * Also updates the height cell of the array
	 * Does not check if the row is in a valid length!
	 * @param	a	The row to unshift
	 */
	inline public function unshiftRow(a:Array<Int>) {
		var dims = this.splice(0, 2);
		dims[1] += 1;
		this = dims.concat(a).concat(this);
	}

	/**
	 * Adds a small matrix to this matrix.
	 * IT doesnt change this matrix, but rather return the combined matrixes
	 * Does not Check for Boundry and overflow!
	 * @param	x	The place to add the matrix in X axis
	 * @param	y	The place to add the matrix in Y axis
	 * @param	matrix	the matrix to add
	 * @return	The combined matrix
	 */
	public inline function addSegment(x:Int, y:Int, matrix:MatrixArray) :MatrixArray
	{
		var a:MatrixArray = copy();
		for (r in 0...matrix.width)
			for (c in 0...matrix.height) {
				if (matrix.getCell(r, c) > 0) a.putCell(x + r, y + c, matrix.getCell(r, c));
			}
		return a;
	}

	/**
	 * Length of this array
	 */
	public var length(get, never):Int;
	inline function get_length() return this.length - 2;

	/**
	 * width of the matrix
	 */
	public var width(get, never):Int;
	inline function get_width() return this[0];

	/**
	 * height of the matrix
	 */
	public var height(get, never):Int;
	inline function get_height() return this[1];

	/**
	 * Change the value of a cell in a given coordinates
	 * DOESN'T check for boundry and overflow
	 * @param	x	the place in X axis
	 * @param	y	the place in Y axis
	 * @param	value	the value to change
	 */
	inline public function putCell(x:Int, y:Int, value:Int):Void {
		putCellByIndex(getIndex(x, y), value);
	}

	/**
	 * Change the value of a cell in a given index
	 * DOESN'T check for boundry and overflow
	 * @param	index	The index of the cell to change
	 * @param	value	the value to change
	 */
	inline public function putCellByIndex(index:Int, value:Int):Void {
		this[index] = value;
	}

	/**
	 * return the value of the cell in given coordinates
	 * @param	x	THE X
	 * @param	y	THE Y
	 * @return	a value of the cell
	 */
	inline public function getCell(x: Int, y: Int):Int
    {
        return getCellByIndex(getIndex(x, y));
    }

	/**
	 * return the value of the cell in a given index
	 * @param	index	The index of the cell in array
	 * @return	the value of the cell
	 */
	inline public function getCellByIndex(index: Int):Int
    {
        return this[index];
    }

	/**
	 * Returns the index in this array of the given coordinates
	 * @param	x	THE X
	 * @param	y	THE Y
	 * @return	return the correct index
	 */
	inline public function getIndex(x: Int, y: Int):Int
    {
        return getRowNum(y) + x;
    }

	/**
	 * Return an array of a full row
	 * @param	rowNum	The number of the row to return
	 * @return	an array with the row values
	 */
	inline public function getRow(rowNum:Int):Array<Int> {
		return getPartRow(rowNum, 0, width);
	}

	/**
	 * Gets an array of a part row.
	 * DOESN'T check for boundries and overflow!
	 * @param	rowNum	the number of the row
	 * @param	offset	the offset within this row
	 * @param	len		The length of the part to return
	 * @return	an array of the value in the part row
	 */
	inline public function getPartRow(rowNum: Int, offset:Int, len:Int):Array<Int> {
		return this.slice(getRowNum(rowNum) + offset, len);
	}

	/**
	 * return a matrix which is a subset of this matrix
	 * @param	x		x coordinate of the matrix
	 * @param	y		y coordinate of the matrix
	 * @param	width	number of cells across
	 * @param	height	number of cells tall
	 * @return	the created matrix
	 */
	inline public function getSection(x:Int, y:Int, width:Int, height:Int): MatrixArray {
		var a = [];
		for (i in 1...height) a = a.concat(getPartRow(x, y, width));
		return new MatrixArray(a, width, height);
	}
}
