<?php
class Audentio_UIX_Route_PrefixAdmin_UIXStyles implements XenForo_Route_Interface
{
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		$action = $router->resolveActionWithStringParam($routePath, $request, 'style_id');
		return $router->getRouteMatch('Audentio_UIX_ControllerAdmin_UIXStyle', $action, 'uix');
	}

	public function buildLink($originalPrefix, $outputPrefix, $action, $extension, $data, array &$extraParams)
	{
		return XenForo_Link::buildBasicLinkWithStringParam($outputPrefix, $action, $extension, $data, 'style_id');
	}
}