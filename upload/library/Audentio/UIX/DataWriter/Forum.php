<?php
class Audentio_UIX_DataWriter_Forum extends XFCP_Audentio_UIX_DataWriter_Forum
{
	protected function _getFields()
	{
		$fields = parent::_getFields();

		$fields['xf_forum']['uix_last_sticky_action'] = array('type' => self::TYPE_UINT, 'default' => 0);

		return $fields;
	}

	protected function _preSave()
	{
		parent::_preSave();

		if (array_key_exists('uix_last_sticky_action', $GLOBALS)) {
			$this->set('uix_last_sticky_action', $GLOBALS['uix_last_sticky_action']);
		}
	}
}

if (false) {
	class XFCP_Audentio_UIX_DataWriter_Forum extends XenForo_DataWriter_Forum {}
}