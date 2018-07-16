package display;
import data.MatrixArray;
import data.Constants;
import interfaces.IRenderer;
import js.Browser;
import js.Lib;
import js.html.CSSStyleDeclaration;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.DivElement;
import js.html.PreElement;
import logic.GameActions;

/**
 * this class is the Javasript renderer of the tetris game.
 * It's main method is the render method that gets the matrixes data to render.
 * @author IAP
 */
class JSRenderer
{
	// The canvas for the main board
	var boardCanvas:CanvasElement;
	// the canvas for the Next Block
	var blockCanvas:CanvasElement;
	// a pre element for keeping the score
	var score:PreElement;

	var blankBlock:MatrixArray;

	/**
	 * Construct the renderer.
	 * It's also listens to a signal for end game
	 */
	public function new() {
		GameActions.instance.actions[EndGame].add(function() {
			drawMatrix(blankBlock, blockCanvas.getContext2d());
		});
		blankBlock = new MatrixArray([for (i in 0...4 * 4) 0], 4, 4);

	}

	/**
	 * This method initialize the html elements for displaying the information
	 */
	public function init() {
		if (boardCanvas == null) boardCanvas = this.createCanvasElement(Constants.BOARD_DIMENTIONS.x * Constants.CELL_WIDTH, Constants.BOARD_DIMENTIONS.y * Constants.CELL_WIDTH);
		if (blockCanvas == null) blockCanvas = this.createCanvasElement(4 * Constants.CELL_WIDTH, 4 * Constants.CELL_WIDTH);
		if (score == null) score = cast Browser.document.body.appendChild(Browser.document.createPreElement());
	}

	/**
	 * a helper method for creating a canvas element in the right dimentions
	 * @param	width	width of the canvas element
	 * @param	height	height of the canvas element
	 * @return	the created element
	 */
	function createCanvasElement(width:Int, height:Int):CanvasElement {
		var canvas = js.Browser.document.createCanvasElement();
		canvas.width  = width;
		canvas.height = height;
		js.Browser.document.body.appendChild(canvas);

		return canvas;
	}

	/**
	 * Draws the given "MatrixArray" onto the supplied 2D context.
	 * This method DOES'T check for out of boundry
	 * @param	blockMatrix	the matrix to draw
	 * @param	ctx	the context to draw to
	 */
	function drawMatrix(blockMatrix:MatrixArray, ctx:CanvasRenderingContext2D) {
		for (r in 0...blockMatrix.width) {
			for (c in 0...blockMatrix.height) {
				ctx.fillStyle = Constants.COLORS[blockMatrix.getCell(r, c)];
				var wid = Constants.CELL_WIDTH;
				//ctx.strokeStyle = "#FFFFFF";
				//ctx.strokeRect(r * wid, c * wid,  wid,  wid);
				ctx.fillRect(r * wid, c * wid, wid, wid);
			}
		}
	}

	/**
	 * render the game on the html page
	 * @param	compositeMatrix	the composite matrix, of the main board plus the current block
	 * @param	nextBlock	the next block to display
	 * @param	score		what is the current score.
	 */
	public function render(compositeMatrix:MatrixArray, nextBlock:MatrixArray, score:Int) {
		Browser.window.requestAnimationFrame(function (time) {
			drawMatrix(compositeMatrix, boardCanvas.getContext2d());
			drawMatrix(blankBlock, blockCanvas.getContext2d());
			drawMatrix(nextBlock, blockCanvas.getContext2d());
			this.score.textContent = 'Score: $score';
		});
	}

}