<?php
class Audentio_UIX_Model_Node extends XFCP_Audentio_UIX_Model_Node
{
	protected $_defaultIcons = array(
		'category_read' => 0,
		'category_unread' => 0,
		'forum_read' => 0,
		'forum_unread' => 0,
		'link_node' => 0,
		'page_node' => 0,
	);

	public function getNodeDataForListDisplay($parentNode, $displayDepth, array $nodePermissions = null)
	{
		$nodeData = parent::getNodeDataForListDisplay($parentNode, $displayDepth, $nodePermissions);

		$xenOptions = XenForo_Application::getOptions();
		if (!$xenOptions->uix_disableLastPostAvatarQueries) {
			if (!empty($nodeData))
			{
				$nodes = $nodeData['nodesGrouped'];

				foreach ($nodes as &$outerNode)
				{
					foreach ($outerNode as &$node)
					{
						if (isset($node['lastPost']['user_id']))
						{
							$users[$node['lastPost']['user_id']] = array();
						}
					}
				}

				if (!empty($users))
				{
					$users = $this->_getAvatarInfo(array_keys($users), array(
						'username',
						'avatar_date',
						'gravatar',
						'gender',
						'is_banned',
					));

					foreach ($nodes as &$outerNode)
					{
						foreach ($outerNode as &$node)
						{
							if (($node['node_type_id'] == "Category"
									|| $node['node_type_id'] == "Forum")
								&& isset($node['lastPost']['user_id'])
								&& !empty($users[$node['lastPost']['user_id']]))
							{
								foreach ($users[$node['lastPost']['user_id']] as $key=>$value)
								{
									$node['uix_lastPostAvatar'][$key] = $value;
								}
							}

						}
					}
				}
			}

			if (!empty($nodes))
			{
				$nodeData['nodesGrouped'] = $nodes;
			}
		}

		return $nodeData;
	}

	public function getAllNodesWithFields()
	{
		return $this->fetchAllKeyed('
			SELECT node.*,
				node_field.uix_node_icons,
				node_field.uix_styling,
				node_field.collapsed
			FROM xf_node AS node
			LEFT JOIN uix_node_fields AS node_field ON (node.node_id = node_field.node_id)
			', 'node_id');
	}

	public function getAllNodeFields()
	{
		return $this->fetchAllKeyed('
			SELECT node_field.*
			FROM uix_node_fields AS node_field
			', 'node_id');
	}

	public function getUixFieldsForNodeId($nodeId)
	{
		return $this->_getDb()->fetchRow('
			SELECT *
			FROM uix_node_fields
			WHERE node_id=?
			', $nodeId);
	}

	public function createEmptyNodeFieldsForNodeId($nodeId)
	{
		return $this->_getDb()->query('
			INSERT INTO uix_node_fields(`node_id`, `uix_node_icons`, `uix_styling`) VALUES ('.$this->_getDb()->quote($nodeId).', \'\', \'\')
			');
	}

	public function rebuildNodeIconCache()
	{
		$nodes = $this->getAllNodesWithFields();
		$nodeIconCache = array();

		foreach ($nodes as $node)
		{
			$nodeIconCache[$node['node_id']] = $this->getNodeIcon($node['node_id'], $nodes);
		}

		$this->_getDataRegistryModel()->set('uix_nodeIconCache', $nodeIconCache);
		$this->rebuildUixNodeCache();
	}

	public function rebuildNodeClassCache()
	{
		$nodes = $this->getAllNodesWithFields();
		$nodeClassCache = array();

		foreach ($nodes as $node)
		{
			$node['uix_styling'] = @unserialize($node['uix_styling']);
			if ($node['uix_styling'] && array_key_exists('nodeInfo-class', $node['uix_styling']))
			{
				$nodeClassCache[$node['node_id']] = $node['uix_styling']['nodeInfo-class'];
			}
		}

		$this->_getDataRegistryModel()->set('uix_nodeClassCache', $nodeClassCache);
		$this->rebuildUixNodeCache();
	}

	public function rebuildNodeCollapseCache()
	{
		$nodes = $this->getAllNodesWithFields();
		$nodeCollapseCache = array();

		foreach ($nodes as $node)
		{
			if ($node['collapsed'])
			{
				$nodeCollapseCache[$node['node_id']] = $node['node_id'];
			}
		}

		$this->_getDataRegistryModel()->set('uix_nodeCollapseCache', $nodeCollapseCache);
		$this->rebuildUixNodeCache();
	}

	public function rebuildUixNodeCache()
	{
		$iconCache = $this->getNodeIconCache();
		$classCache = $this->getNodeClassCache();
		$collapseCache = $this->getNodeCollapseCache();

		$uixCache = array(
			'icon_cache'		=> $iconCache,
			'class_cache'		=> $classCache,
			'collapse_cache'	=> $collapseCache,
		);

		$this->_getDataRegistryModel()->set('uix_nodeCache', $uixCache);
	}

	public function getNodeWithFieldsById($nodeId)
	{
		return $this->_getDb()->fetchRow('
			SELECT node.*,
				node_field.uix_node_icons,
				node_field.uix_styling,
				node_field.collapsed
			FROM xf_node AS node
			LEFT JOIN uix_node_fields AS node_field ON (node.node_id = node_field.node_id)
			WHERE node.node_id=?
			', $nodeId);
	}

	public function getNodeIconCache()
	{
		return $this->_getDataRegistryModel()->get('uix_nodeIconCache');
	}

	public function getNodeClassCache()
	{
		return $this->_getDataRegistryModel()->get('uix_nodeClassCache');
	}

	public function getNodeCollapseCache()
	{
		return $this->_getDataRegistryModel()->get('uix_nodeCollapseCache');
	}

	public function getUixNodeCache()
	{
		return $this->_getDataRegistryModel()->get('uix_nodeCache');
	}

	public function getNodeIcon($nodeId, &$nodes)
	{
		$xenOptions = XenForo_Application::getOptions();
		if ($nodeId == 0)
		{
			$nodes[0]['icons'] = $this->_defaultIcons;
			return $this->_defaultIcons;
		}
		$node = $nodes[$nodeId];
		$node['uix_node_icons'] = @unserialize($node['uix_node_icons']);
		if (array_key_exists('icons', $node))
		{
			$icons = $node['icons'];
		}
		else
		{
			if (!$xenOptions->uix_disableNodeIconInheritance)
			{
				$icons = $node['uix_node_icons'];
				if (!is_array($icons))
				{
					$icons = $this->getNodeIcon($node['parent_node_id'], $nodes);
				}
				else
				{
					$parentIcons = $this->getNodeIcon($node['parent_node_id'], $nodes);
					if (is_array($parentIcons))
					{
						$icons = array_merge($parentIcons, $icons);
					}
				}
			}
			else
			{
				$icons = $node['uix_node_icons'];
			}
		}

		if (!$icons)
		{
			$icons = $this->_defaultIcons;
		}
		foreach ($icons as $iconId => &$icon)
		{
			if (empty($icon))
			{
				$icon = 0;
			}
		}

		$nodes[$nodeId]['icons'] = $icons;

		return $icons;
	}

	protected function _getAvatarInfo($userIds, array $keys)
	{
		if (!$userIds)
		{
			return array();
		}
		return $this->fetchAllKeyed('
				SELECT user.user_id, '.implode(',', $keys) . '
				FROM xf_user AS user
				WHERE user.user_id IN ('.$this->_getDb()->quote($userIds) .')
			', 'user_id');
	}
}

if(false)
{
	class XFCP_Audentio_UIX_Model_Node extends XenForo_Model_Node {}
}