<?php
class Audentio_UIX_Listener_Install_1000110 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		"ALTER TABLE `xf_style` ADD `uix_latest_version` VARCHAR(20) NULL DEFAULT NULL ;",
	);

	public function run()
	{
		$db = XenForo_Application::get('db');
		foreach (self::$_queries as $query)
		{
			self::query($query);
		}
	}
}