<?php
class Audentio_UIX_Listener_Install_1000106 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Alter Tables
		"ALTER TABLE `xf_user_option`
		   ADD `uix_sticky_navigation` TINYINT(3) UNSIGNED NOT NULL DEFAULT '1' ,
		   ADD `uix_sticky_userbar` TINYINT(3) UNSIGNED NOT NULL DEFAULT '1' ,
		   ADD `uix_sticky_sidebar` TINYINT(3) UNSIGNED NOT NULL DEFAULT '1' ,
		   ADD `uix_width` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0' ;",
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