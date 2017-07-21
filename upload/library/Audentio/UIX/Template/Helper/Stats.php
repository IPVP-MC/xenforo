<?php
class Audentio_UIX_Template_Helper_Stats
{
	protected static $_statModel;
	public static function stats()
	{
		$statModel = self::_getStatModel();
		$numArgs = func_num_args();
		if (!$numArgs) return false;
		$stat = func_get_arg(0);
		$options = array();
		if ($numArgs > 1)
		{
			for ($i=1;$i<$numArgs;$i++)
			{
				$options[] = func_get_arg($i);
			}
		}

		return $statModel->getStat($stat, $options);
	}

	/**
	 * Returns the UI.X Stats Model
	 * @return Audentio_UIX_Model_Stats
	 */
	protected static function _getStatModel()
	{
		if (self::$_statModel == null)
		{
			self::$_statModel = XenForo_Model::create('Audentio_UIX_Model_Stats');
		}
		return self::$_statModel;
	}
}