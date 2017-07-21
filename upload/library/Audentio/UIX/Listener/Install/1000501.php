<?php
class Audentio_UIX_Listener_Install_1000501 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		"ALTER TABLE `xf_user_option` ADD `uix_collapse_signature` TINYINT(3) UNSIGNED NOT NULL DEFAULT '1' AFTER `uix_collapse_user_info`;",
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