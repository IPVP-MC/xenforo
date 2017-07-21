<?php
class Audentio_UIX_Listener_Install_1000371 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		"ALTER TABLE `xf_forum` ADD `uix_last_sticky_action` INT(10) UNSIGNED NOT NULL DEFAULT '0';",
		"ALTER TABLE `xf_user_option` CHANGE `uix_collapse_stuck_threads` `uix_collapse_stuck_threads` INT(10) UNSIGNED NOT NULL DEFAULT '0';",
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