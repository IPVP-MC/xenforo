<?php
class Audentio_UIX_Model_NodeLayout extends XenForo_Model
{
	public function getLayoutOptionsByNodeId($nodeId)
	{
		if ($nodeId != 0 && $nodeId != 10240)
		{
			return $this->_getDb()->fetchRow('
				SELECT layout.*,
					node.*
				FROM uix_node_layout AS layout
				JOIN xf_node AS node ON (layout.node_id = node.node_id)
				WHERE layout.node_id = ?
				', $nodeId);
		}
		else
		{
			return $this->_getDb()->fetchRow('
				SELECT *
				FROM uix_node_layout
				WHERE node_id = ?
				', $nodeId);
		}
	}

	public function getLayoutOptions($getNode=false)
	{
		if ($getNode)
		{
			return $this->fetchAllKeyed('
				SELECT *,
					node.*
				FROM uix_node_layout AS layout
				INNER JOIN xf_node AS node ON (node.node_id = layout.node_id)
				', 'node_id');
		}
		else
		{
			return $this->fetchAllKeyed('
				SELECT *
				FROM uix_node_layout
				', 'node_id');
		}
	}
}