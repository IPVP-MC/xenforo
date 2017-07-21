<?php
class Audentio_UIX_Listener_Install_1000271 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		"ALTER TABLE `xf_user_option` ADD `uix_sidebar` INT(10) UNSIGNED NOT NULL DEFAULT '0' ;",
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