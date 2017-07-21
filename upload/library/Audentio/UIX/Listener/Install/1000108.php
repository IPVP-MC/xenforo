<?php
class Audentio_UIX_Listener_Install_1000108 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Alter Tables
		"ALTER TABLE `uix_node_fields` ADD `collapsed` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0' ;",
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