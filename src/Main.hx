package;

import js.Lib;
import logic.GameActions;

/**
 * ...
 * @author IAP
 */
class Main
{
	var game:GameEngine;
	public function new() {
		this.game = new GameEngine();
		game.init();
		GameActions.instance.actions[Actions.StartGame].dispatch();
	}

	static function main()
	{
		var main = new Main();
	}

}