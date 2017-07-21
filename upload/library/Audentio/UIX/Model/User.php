<?php
class Audentio_UIX_Model_User extends XFCP_Audentio_UIX_Model_User
{
	public function uix_resetUserWidths($newWidth)
	{
		$newWidth = (int) $newWidth;
		$db = XenForo_Application::getDb();
		$db->beginTransaction();
		$db->query('UPDATE xf_user_option SET uix_width=? WHERE uix_width<>?', array($newWidth, $newWidth));
		$db->commit();
	}
}
if (false)
{
	class XFCP_Audentio_UIX_Model_User extends XenForo_Model_User {}
}