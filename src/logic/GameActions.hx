package logic;
import msignal.Signal;

/**
 * This class represents a game action, and can attach a trigger to this game action
 * This class is a singletone, as there is no need to make more instances of it
 * @author IAP
 */
class GameActions
{
	private static var _instance:GameActions;
	public static var instance(get, null):GameActions;

	public var actions:Map<Actions, Signal0>;

	private function new()
	{
		actions = new Map<Actions, Signal0>();
		for (i in Type.allEnums(Actions))
		{
			actions[i] = new Signal0();
		}
	}

	static function get_instance():GameActions
	{
		if (_instance == null) _instance = new GameActions();

		return _instance;
	}

}

enum Actions
{
	RotateLeft;
	RotateRight;
	MoveLeft;
	MoveRight;
	MoveDown;
	StartGame;
	EndGame;
	GameStep;
}