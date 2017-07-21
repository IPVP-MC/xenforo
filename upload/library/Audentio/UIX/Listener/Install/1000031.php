<?php
class Audentio_UIX_Listener_Install_1000031 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Alter Tables
		'ALTER TABLE xf_style
		  ADD  audentio TINYINT( 3 ) UNSIGNED NOT NULL DEFAULT  \'0\' AFTER  user_selectable ,
		  ADD  uix_pid INT( 10 ) NULL DEFAULT NULL AFTER  audentio ,
		  ADD  uix_version VARCHAR( 20 ) NULL DEFAULT NULL ,
		  ADD uix_update_available TINYINT(3) NOT NULL DEFAULT \'0\';',
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