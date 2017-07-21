<?php
class Audentio_UIX_Listener_Uninstall
{
	protected static $_queries = array(
		'ALTER TABLE xf_style
		  DROP audentio',
		'ALTER TABLE xf_style
		  DROP uix_pid',
		'ALTER TABLE xf_style
		  DROP uix_version',
		'ALTER TABLE xf_style
		  DROP uix_update_available',
		'ALTER TABLE xf_style
		  DROP uix_latest_version',
		'DROP TABLE uix_node_layout',
		'DELETE FROM xf_node_type WHERE node_type_id=\'uix_nodeLayoutSeparator\'',
		'DELETE FROM xf_node WHERE node_type_id=\'uix_nodeLayoutSeparator\'',
		'DROP TABLE uix_node_fields',
		"ALTER TABLE `xf_user_option`
		  DROP `uix_sticky_navigation`",
		"ALTER TABLE `xf_user_option`
		  DROP `uix_sticky_userbar`",
		"ALTER TABLE `xf_user_option`
		  DROP `uix_sticky_sidebar`",
		"ALTER TABLE `xf_user_option`
		  DROP `uix_width`",
		"ALTER TABLE `xf_user_option`
		  DROP `uix_collapse_stuck_threads`",
		"ALTER TABLE `xf_user_option`
		  DROP `uix_sidebar`",
		"ALTER TABLE `xf_user_option` DROP `uix_collapse_user_info`",
		"ALTER TABLE `xf_forum` DROP `uix_last_sticky_action`;",
		"ALTER TABLE `xf_user_option` DROP `uix_collapse_signature`",
	);

	public static function run($addOnData)
	{
		$db = XenForo_Application::get('db');
		foreach (self::$_queries as $query)
		{
			try
			{
				$db->query($query);
			}
			catch (Exception $e) {
				XenForo_Error::logError($e->getMessage());
			}
		}
		XenForo_Model::create('XenForo_Model_ContentType')->rebuildContentTypeCache();
	}
}