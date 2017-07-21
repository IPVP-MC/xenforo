<?php
class Audentio_UIX_DataWriter_NodeLayout extends XenForo_DataWriter
{
	protected function _getFields()
	{
		return array(
			'uix_node_layout'		=> array(
				'node_id'			=> array('type' => self::TYPE_UINT, 'required' => true),
				'layout_data'		=> array('type' => self::TYPE_STRING, 'required' => true),
			)
		);
	}

	protected function _getExistingData($data)
	{
		if (!$nodeId = $this->_getExistingPrimaryKey($data, 'node_id'))
		{
			if ($nodeId != 0)
			{
				return false;
			}
		}

		return array('uix_node_layout' => $this->_getLayoutModel()->getLayoutOptionsByNodeId($nodeId));
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