package interfaces;
import data.MatrixArray;

/**
 * @author IAP
 */
interface IRenderer
{

	function render(compositeMatrix:MatrixArray, nextBlock:MatrixArray, score:Int):Void;
	function update(data:Array<Int>):Void;
	function init():Void;
}