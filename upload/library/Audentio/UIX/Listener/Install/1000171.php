<?php
class Audentio_UIX_Listener_Install_1000171 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		"UPDATE `xf_user_option` SET `uix_width` = 0;",
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