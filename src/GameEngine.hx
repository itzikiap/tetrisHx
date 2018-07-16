package;
import data.BoardManager;
import data.Constants;
import data.MatrixArray;
import display.JSRenderer;
import haxe.Timer;
import interfaces.IRenderer;
import logic.GameActions;
import logic.GameActions.Actions;
import logic.JSKeyboardActions;
/**
 * This is the main engine of the game.
 * The game logic is set here, and the checking for all the parts pf the game
 * @author IAP
 */
class GameEngine {
	var output:JSRenderer;
	var input:JSKeyboardActions;
	var engine:GameEngine;
	var actions:GameActions;
	var board:BoardManager;
	var score:Int;
	var gameStepTimer:Timer;
	var initialized:Bool;

	public function new() {
		initialized = false;
	}

	/**
	 * initialize the game
	 */
	public function init() {
		if (initialized) return;

		initialized = true;

		output = new JSRenderer();
		input = new JSKeyboardActions();
		actions = GameActions.instance;
		board = new BoardManager();

		input.init();


		// all of the game actions are going through Signals events.
		// Although there is only one listener for most of the signals,
		// this allows for distributed actions in the application,
		// and the flexibility for adding more actions if needed
		actions.actions[MoveRight].add(function ()  performBoardAction(Right));
		actions.actions[MoveLeft].add(function ()  performBoardAction(Left));
		actions.actions[MoveDown].add(function ()  performBoardAction(Down));
		actions.actions[RotateLeft].add(function ()  performBoardAction(Rotate));
		actions.actions[GameStep].add(function () performGameStep());
		actions.actions[StartGame].add(function () startGame());
		actions.actions[EndGame].add(function () endGame());
	}

	/**
	 * Starts the game.
	 * It clear all the boards and data,
	 * generate the first blocks,
	 * reset the score
	 * and starts the timer.
	 */
	function startGame() {
		output.init();
		board.clearBoard();
		board.generateNextBlock();
		board.generateNextBlock();

		resetScore();

		if (gameStepTimer != null) gameStepTimer.stop();
		gameStepTimer = new Timer(Constants.GAME_STEP_INTERVAL);
		gameStepTimer.run = actions.actions[GameStep].dispatch;
	}

	/**
	 * Ends the game.
	 * Actually pause for 2 seconds and start over again
	 */
	function endGame() {
		if (gameStepTimer != null) gameStepTimer.stop();
		Timer.delay(actions.actions[StartGame].dispatch, 2000);
	}

	/**
	 * This is the main loop of the game, it is dispatch according to the
	 * GameStepInterval constant
	 * The actual movement of the block is instantly when the player press the keyboard
	 * in the game step, the block is pulled down, and checked against the bonudrry.
	 * If it touched the "floor" or another block, it will be "baled" in the matrix,
	 * and the game will check to see if there are rows that were fulled withe colors,
	 * if so it updates the score.
	 */
	function performGameStep() {
		if (!board.checkMovement(0, 1)) {
			board.bakeCompositeMatrix();
			board.generateNextBlock();
			var a:Array<Int> = board.checkFullRow();
			board.removeRows(a);
			updateScore(a.length);
			if (!board.checkMovement(0, 1)) {
				actions.actions[EndGame].dispatch();
			}
			Constants.GAME_STEP_INTERVAL -= a.length;
			Constants.GAME_STEP_INTERVAL = cast Math.max(Constants.GAME_STEP_INTERVAL, 10);
			refreshBoard();
		} else {
			performBoardAction(Down);
		}
	}

	function resetScore() {
		this.score = 0;
	}

	/**
	 * Calcolate the score to add. The score is raised exponentially,
	 * such that deleting one row will get you to score 1 point, but 4 rows will give you 20 points etc...
	 * @param	rows 	the number of rows that were removed last step
	 */
	function updateScore(rows:Int) {
		score += Math.round(rows * rows * 1.2);
	}

	/**
	 * after an event of board change, update the block, and refresh the display if needed
	 * @param	action
	 */
	function performBoardAction(action:BoardAction):Void {
		board.performAction(action);
		refreshBoard();
	}

	/**
	 * actually renders the board
	 */
	function refreshBoard() {
		output.render(board.getCompositeMatrix(), board.getNextBlock(), score);
	}

}