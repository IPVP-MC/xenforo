<?php
class Audentio_UIX_Listener_Install_1000101 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Alter Tables
		'ALTER TABLE `xf_node` ADD `uix_node_icons` MEDIUMBLOB NOT NULL;',
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