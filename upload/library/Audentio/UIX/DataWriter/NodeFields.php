<?php
class Audentio_UIX_DataWriter_NodeFields extends XenForo_DataWriter
{
	protected function _getFields()
	{
		$fields['uix_node_fields']['node_id'] = array('type' => self::TYPE_UINT, 'required' => true);
		$fields['uix_node_fields']['uix_node_icons'] = array('type' => self::TYPE_STRING, 'default' => '');
		$fields['uix_node_fields']['uix_styling'] = array('type' => self::TYPE_STRING, 'default' => '');
		$fields['uix_node_fields']['collapsed'] = array('type' => self::TYPE_BOOLEAN, 'default' => 0);

		return $fields;
	}

	public function setUixNodeIcons(array $nodeIcons = array())
	{
		$this->set('uix_node_icons', @serialize($nodeIcons), 'uix_node_fields');
	}

	public function setUixStyling(array $styling = array())
	{
		$this->set('uix_styling', @serialize($styling), 'uix_node_fields');
	}

	protected function _postSave()
	{
		if ($this->isInsert() || $this->isChanged('uix_node_icons'))
		{
			$this->getModelFromCache('XenForo_Model_Node')->rebuildNodeIconCache();
		}
		if ($this->isInsert() || $this->isChanged('uix_styling'))
		{
			$this->getModelFromCache('XenForo_Model_Node')->rebuildNodeClassCache();
		}
		if ($this->isInsert() || $this->isChanged('collapsed'))
		{
			$this->getModelFromCache('XenForo_Model_Node')->rebuildNodeCollapseCache();
		}
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

		return array('uix_node_fields' => $this->getModelFromCache('XenForo_Model_Node')->getNodeWithFieldsById($nodeId));
	}

	protected function _getUpdateCondition($tableName)
	{
		return 'node_id = ' . $this->_db->quote($this->getExisting('node_id'));
	}
}