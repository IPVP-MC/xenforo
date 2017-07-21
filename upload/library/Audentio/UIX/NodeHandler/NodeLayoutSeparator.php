<?php
class Audentio_UIX_NodeHandler_NodeLayoutSeparator extends XenForo_NodeHandler_Abstract
{
	public function isNodeViewable(array $node, array $nodePermissions)
	{
		return true;
	}

	public function renderNodeForTree(XenForo_View $view, array $node, array $permissions, array $renderedChildren, $level)
	{
		$viewParams = array(
			'node' => $node,
		);
		return $view->createTemplateObject('uix_node_layout_separator', $viewParams)->render();
	}
}