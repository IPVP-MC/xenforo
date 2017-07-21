<?php
class Audentio_UIX_DataWriter_User extends XFCP_Audentio_UIX_DataWriter_User
{
	protected function _getFields()
	{
		$xenOptions = XenForo_Application::getOptions();
		$fields = parent::_getFields();
		$fields['xf_user_option']['uix_sticky_navigation'] = array(
			'type'		=> self::TYPE_BOOLEAN,
			'default'	=> 1,
		);
		$fields['xf_user_option']['uix_sticky_userbar'] = array(
			'type'		=> self::TYPE_BOOLEAN,
			'default'	=> 1,
		);
		$fields['xf_user_option']['uix_sticky_sidebar'] = array(
			'type'		=> self::TYPE_BOOLEAN,
			'default'	=> 1,
		);
		$fields['xf_user_option']['uix_width'] = array(
			'type'		=> self::TYPE_BOOLEAN,
			'default'	=> $xenOptions->uix_defaultWidth,
		);
		$fields['xf_user_option']['uix_collapse_stuck_threads'] = array(
			'type'		=> self::TYPE_UINT,
			'default'	=> 0,
		);
		$fields['xf_user_option']['uix_sidebar'] = array(
			'type'		=> self::TYPE_UINT,
			'default'	=> 1,
		);
		$fields['xf_user_option']['uix_collapse_user_info'] = array(
			'type'		=> self::TYPE_UINT,
			'default'	=> 1,
		);
		$fields['xf_user_option']['uix_collapse_signature'] = array(
			'type'		=> self::TYPE_UINT,
			'default'	=> 1,
		);

		return $fields;
	}

	protected function _preSave()
	{
		if (array_key_exists('uix_sticky_navigation', $GLOBALS))
		{
			$this->set('uix_sticky_navigation', $GLOBALS['uix_sticky_navigation']);
		}
		if (array_key_exists('uix_sticky_userbar', $GLOBALS))
		{
			$this->set('uix_sticky_userbar', $GLOBALS['uix_sticky_userbar']);
		}
		if (array_key_exists('uix_sticky_sidebar', $GLOBALS))
		{
			$this->set('uix_sticky_sidebar', $GLOBALS['uix_sticky_sidebar']);
		}
		if (array_key_exists('uix_collapse_user_info', $GLOBALS))
		{
			$this->set('uix_collapse_user_info', $GLOBALS['uix_collapse_user_info']);
		}
		if (array_key_exists('uix_collapse_signature', $GLOBALS))
		{
			$this->set('uix_collapse_signature', $GLOBALS['uix_collapse_signature']);
		}
		parent::_preSave();

	}
}

if (false) {
	class XFCP_Audentio_UIX_DataWriter_User extends XenForo_DataWriter_User {}
}