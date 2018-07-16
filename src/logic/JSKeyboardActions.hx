package logic;
import js.Browser;
import js.html.KeyEvent;
import js.html.KeyboardEvent;
import logic.GameActions.Actions;

/**
 * Class for recieveing Keyboard events and dispatching game action signals
 * @author IAP
 */
class JSKeyboardActions{

	public function new() {

	}

	public function init() {
		Browser.document.addEventListener("keydown", handleKeyboard);
		Browser.document.body.focus();
	}

	/**
	 * Handle the keyboard event.
	 * Prevent a default operation if one of the events was proccessed
	 */
	function handleKeyboard(ev:KeyboardEvent) {
		var prevent = true;
		switch(ev.keyCode) {
			case KeyboardEvent.DOM_VK_LEFT:
				GameActions.instance.actions[Actions.MoveLeft].dispatch();
			case KeyboardEvent.DOM_VK_RIGHT:
				GameActions.instance.actions[Actions.MoveRight].dispatch();
			case KeyboardEvent.DOM_VK_UP:
				GameActions.instance.actions[Actions.RotateLeft].dispatch();
			case KeyboardEvent.DOM_VK_DOWN:
				GameActions.instance.actions[Actions.MoveDown].dispatch();

			default:
				prevent = false;
		}
		if (prevent) ev.preventDefault();
	}

}