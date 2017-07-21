<?php
class Audentio_UIX_Route_PrefixAdmin_UIXOptions implements XenForo_Route_Interface
{
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		if (strpos($routePath, '/') !== false)
		{
			list($action, $value) = explode('/', $routePath);
			if (strpos($action, '-option') !== false)
			{
				$request->setParam('option_id', $value);
			}
			else
			{
				$request->setParam('group_id', $value);
			}
		}
		else
		{
			$action = $routePath;
		}

		return $router->getRouteMatch('Audentio_UIX_ControllerAdmin_UIXOptions', $action, 'uix');
	}

	public function buildLink($originalPrefix, $outputPrefix, $action, $extension, $data, array &$extraParams)
	{
		if (is_array($data))
		{
			XenForo_Link::prepareExtensionAndAction($extension, $action);

			if (strpos($action, '-option') !== false)
			{
				if (isset($data['option_id']))
				{
					return "$outputPrefix/$action/$data[option_id]$extension";
				}
			}
			else if (isset($data['group_id']))
			{
				return "$outputPrefix/$action/$data[group_id]$extension";
			}
		}

		return false;
	}
}