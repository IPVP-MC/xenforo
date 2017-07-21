<?php
class Audentio_UIX_DataWriter_Style extends XFCP_Audentio_UIX_DataWriter_Style
{
	protected function _getFields()
	{
		$fields = parent::_getFields();

		$fields['xf_style']['audentio'] = array('type' => self::TYPE_BOOLEAN, 'default' => 0);
		$fields['xf_style']['uix_pid'] = array('type' => self::TYPE_UINT, 'default' => NULL);
		$fields['xf_style']['uix_version'] = array('type' => self::TYPE_STRING, 'default' => NULL);
		$fields['xf_style']['uix_update_available'] = array('type' => self::TYPE_BOOLEAN, 'default' => 0);
		$fields['xf_style']['uix_update_available'] = array('type' => self::TYPE_BOOLEAN, 'default' => 0);
		$fields['xf_style']['uix_latest_version'] = array('type' => self::TYPE_STRING, 'default' => NULL);
		return $fields;
	}
}