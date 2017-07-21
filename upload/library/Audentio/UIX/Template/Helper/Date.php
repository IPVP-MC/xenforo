<?php
class Audentio_UIX_Template_Helper_Date
{
	public static function helperDateTimeHtml($timestamp, $attributes = array())
	{
		$class = (empty($attributes['class']) ? '' : ' ' . htmlspecialchars($attributes['class']));

		unset($attributes['time'], $attributes['class']);

		$attribs = XenForo_Template_Helper_Core::getAttributes($attributes);

		$time = XenForo_Locale::dateTime($timestamp, 'separate', XenForo_Template_Helper_Core::getDefaultLanguage());

		$tag = 'abbr';
		$data = ' data-time="' . $timestamp . '" data-diff="' . (XenForo_Application::$time - $timestamp)
			. '" data-datestring="' . $time['date'] . '" data-timestring="' . $time['time'] . '"';
		$value = $time['string'];

		$rtlPrefix = XenForo_Locale::getRtlDateTimeMarker(XenForo_Template_Helper_Core::getDefaultLanguage());

		return "<{$tag} class=\"uix_DateTime{$class}\"{$attribs}{$data}>$rtlPrefix{$value}</{$tag}>";
	}
}