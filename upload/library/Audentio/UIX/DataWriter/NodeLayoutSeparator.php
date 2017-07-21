<?php
class Audentio_UIX_DataWriter_NodeLayoutSeparator extends XenForo_DataWriter_Node
{
	protected function _getFields()
	{
		return parent::_getFields() + array(
			'uix_node_layout'		=> array(
				'node_id'			=> array('type' => self::TYPE_UINT, 'default' => array('xf_node', 'node_id'), 'required' => true),
				'layout_data'		=> array('type' => self::TYPE_STRING, 'required' => true),
			)
		);
	}

	protected function _getExistingData($data)
	{
		if (!$nodeId = $this->_getExistingPrimaryKey($data))
		{
			return false;
		}

		$node = $this->_getLayoutModel()->getLayoutOptionsByNodeId($nodeId);


		return $this->getTablesDataFromArray($node);
	}

	protected function _getUpdateCondition($tableName)
	{
		return 'node_id = ' . $this->_db->quote($this->getExisting('node_id'));
	}

	protected function _getLayoutModel()
	{
		return $this->getModelFromCache('Audentio_UIX_Model_NodeLayout');
	}
}