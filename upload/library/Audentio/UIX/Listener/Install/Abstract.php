<?php
class Audentio_UIX_Listener_Install_Abstract
{
	public static function query($query)
	{
		try {
			$db = XenForo_Application::getDb();
			$db->query($query);
		} catch (Exception $e) {
			XenForo_Error::logError($e->getMessage());
		}

	}
}