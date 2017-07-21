<?php
class Audentio_UIX_Route_PrefixAdmin_NodeLayoutSeparator
{
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		$action = $router->resolveActionWithIntegerParam($routePath, $request, 'node_id');
		return $router->getRouteMatch('Audentio_UIX_ControllerAdmin_NodeLayoutSeparator', $action, 'nodes');
	}

	public function buildLink($originalPrefix, $outputPrefix, $action, $extension, $data, array &$extraParams)
	{
		return XenForo_Link::buildBasicLinkWithIntegerParam($outputPrefix, $action, $extension, $data, 'node_id', 'title');
	}
}