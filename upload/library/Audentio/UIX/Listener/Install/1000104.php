<?php
class Audentio_UIX_Listener_Install_1000104 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Alter Tables
		'CREATE TABLE IF NOT EXISTS `uix_node_fields` (
		  `node_id` int(10) unsigned NOT NULL,
		  `uix_node_icons` mediumblob NOT NULL,
		  `uix_styling` mediumblob NOT NULL,
		  PRIMARY KEY (`node_id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
		'ALTER TABLE `xf_node` DROP `uix_node_icons`;',
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