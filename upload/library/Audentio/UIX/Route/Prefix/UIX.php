<?php
class Audentio_UIX_Route_Prefix_UIX implements XenForo_Route_Interface
{
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		return $router->getRouteMatch('Audentio_UIX_ControllerPublic_UIX', $routePath, 'uix');
	}
}