<?php
class Audentio_UIX_DataWriter_Node extends XFCP_Audentio_UIX_DataWriter_Node
{
	protected function _getFields()
	{
		$fields = parent::_getFields();

		$fields['uix_node_fields']['node_id'] = array('type' => self::TYPE_UINT, 'default' => array('xf_node', 'node_id'), 'required' => true);
		$fields['uix_node_fields']['uix_node_icons'] = array('type' => self::TYPE_STRING, 'default' => '');
		$fields['uix_node_fields']['uix_styling'] = array('type' => self::TYPE_STRING, 'default' => '');

		return $fields;
	}

	protected function _setUixNodeIcons(array $nodeIcons = array())
	{
		$this->set('uix_node_icons', @serialize($nodeIcons), 'uix_node_fields');

	}

	protected function _setUixStyling(array $styling = array())
	{
		$this->set('uix_styling', @serialize($styling), 'uix_node_fields');
	}

	protected function _preSave()
	{
		parent::_preSave();
		if (array_key_exists('uix_node_icons', $GLOBALS))
		{
			$this->_setUixNodeIcons($GLOBALS['uix_node_icons']);
		}
		if (array_key_exists('uix_styling', $GLOBALS))
		{
			$this->_setUixStyling($GLOBALS['uix_styling']);
		}
	}

	protected function _postSave()
	{
		parent::_postSave();
		if ($this->isInsert() || $this->isChanged('uix_node_icons'))
		{
			$this->_getNodeModel()->rebuildNodeIconCache();
		}
	}
}
if (false)
{
	class XFCP_Audentio_UIX_DataWriter_Node extends XenForo_DataWriter_Node {}
}