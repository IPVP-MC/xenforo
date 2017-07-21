<?php
class Audentio_UIX_Listener_Install_1000032 extends Audentio_UIX_Listener_Install_Abstract
{
	protected static $_queries = array(
		// Create Tables
		'CREATE TABLE IF NOT EXISTS uix_node_layout (
		  node_id int(10) unsigned NOT NULL,
		  layout_data mediumblob NOT NULL,
		  PRIMARY KEY (node_id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
		'INSERT INTO xf_node_type (node_type_id, handler_class, controller_admin_class, datawriter_class, permission_group_id, moderator_interface_group_id, public_route_prefix) VALUES (\'uix_nodeLayoutSeparator\', \'Audentio_UIX_NodeHandler_NodeLayoutSeparator\', \'Audentio_UIX_ControllerAdmin_NodeLayoutSeparator\', \'Audentio_UIX_DataWriter_NodeLayoutSeparator\', \'uix_nodeLayoutSeparator\', \'\', \'\')',
		'INSERT INTO uix_node_layout (node_id, layout_data) VALUES
			(0, 0x7b226d6178696d756d5f636f6c756d6e73223a7b2276616c7565223a2236227d2c226d696e696d756d5f636f6c756d6e5f7769647468223a7b2276616c7565223a22333330227d2c2266696c6c5f6c6173745f726f77223a7b2276616c7565223a2230227d2c22636f6c756d6e5f776964746873223a7b2276616c7565223a2230227d2c22637573746f6d5f636f6c756d6e5f776964746873223a7b22636f756e74223a22222c226c61796f757473223a7b2231223a7b2231223a22227d2c2232223a7b2231223a22222c2232223a22227d2c2233223a7b2231223a22222c2232223a22222c2233223a22227d2c2234223a7b2231223a22222c2232223a22222c2233223a22222c2234223a22227d2c2235223a7b2231223a22222c2232223a22222c2233223a22222c2234223a22222c2235223a22227d2c2236223a7b2231223a22222c2232223a22222c2233223a22222c2234223a22222c2235223a22222c2236223a22227d7d7d7d),
			(10240, 0x7b226d6178696d756d5f636f6c756d6e73223a7b2276616c7565223a2231227d2c226d696e696d756d5f636f6c756d6e5f7769647468223a7b2276616c7565223a22227d2c2266696c6c5f6c6173745f726f77223a7b2276616c7565223a2230227d2c22636f6c756d6e5f776964746873223a7b2276616c7565223a2230227d2c22637573746f6d5f636f6c756d6e5f776964746873223a7b22636f756e74223a22222c226c61796f757473223a7b2231223a7b2231223a22227d7d7d7d);'
	);

	public function run()
	{
		$db = XenForo_Application::get('db');
		foreach (self::$_queries as $query)
		{
			self::query($query);
		}

		XenForo_Model::create('XenForo_Model_Node')->rebuildNodeTypeCache();
	}
}