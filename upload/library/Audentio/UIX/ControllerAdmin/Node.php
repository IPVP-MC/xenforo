<?php
class Audentio_UIX_ControllerAdmin_Node extends XFCP_Audentio_UIX_ControllerAdmin_Node
{
	public function actionRebuildIconCache()
	{
		$nodeModel = $this->_getNodeModel();
		$nodeModel->rebuildNodeIconCache();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('options/list/uix_nodeIcons'));
	}

	public function actionRebuildClassCache()
	{
		$nodeModel = $this->_getNodeModel();
		$nodeModel->rebuildNodeClassCache();
		die;
	}

	public function actionIndex()
	{
		if ($this->isConfirmedPost())
		{
			$nodes = $this->_input->filterSingle('node', XenForo_Input::ARRAY_SIMPLE);

			foreach ($nodes as $nodeId=>$options)
			{
				$writer = XenForo_DataWriter::create('XenForo_DataWriter_Node');
				$writer->setExistingData($nodeId);
				if (array_key_exists('display_order', $options))
				{
					$writer->set('display_order', $options['display_order']);
				}

				if (array_key_exists('parent_node_id', $options))
				{
					$writer->set('parent_node_id', $options['parent_node_id']);
				}
				$writer->save();
			}
			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes'));
		}
		else
		{
			return parent::actionIndex();
		}
	}

	public function actionUixOption()
	{
		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::UINT);
		$node = $this->_getNodeModel()->getNodeWithFieldsById($nodeId);
		if (!$node)
		{
			return $this->responseError(new XenForo_Phrase('uix_invalid_node_selected'));
		}

		if ($node['node_type_id'] == 'Category')
		{
			if ($this->isConfirmedPost())
			{
				$action = $this->_input->filterSingle('action', XenForo_Input::STRING);
				if ($action == 'layout')
				{
					return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes/layout', $node));
				}
				else
				{
					return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes/uix-options', $node));
				}
			}
			$viewParams = array(
				'node'	=> $node,
			);
			return $this->responseView('Audentio_UIX_ViewPublic_Node_UIXOption', 'uix_node_option', $viewParams);
		}

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes/uix-options', $node));
	}

	public function actionUixOptions()
	{
		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::UINT);
		$node = $this->_getNodeModel()->getNodeWithFieldsById($nodeId);
		if (!$node)
		{
			return $this->responseError(new XenForo_Phrase('uix_invalid_node_selected'));
		}

		if ($this->isConfirmedPost())
		{
			$nodeIcons = $this->_input->filterSingle('uix_node_icons', XenForo_Input::STRING, array('array' => true));
			$styling = $this->_input->filterSingle('uix_styling', XenForo_Input::ARRAY_SIMPLE);
			$collapsed = $this->_input->filterSingle('collapsed', XenForo_Input::BOOLEAN);

			$writer = XenForo_DataWriter::create('Audentio_UIX_DataWriter_NodeFields');
			$writer->setUixNodeIcons($nodeIcons);
			$writer->setUixStyling($styling);
			$writer->set('collapsed', $collapsed);
			if ($node['uix_styling'] === null && $node['uix_node_icons'] === null)
			{
				$writer->set('node_id', $nodeId);
			}
			else
			{
				$writer->setExistingData($node['node_id']);
			}
			$writer->save();
			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes'));
		}
		else
		{
			$node['uix_node_icons'] = @unserialize($node['uix_node_icons']);
			$node['uix_styling'] = @unserialize($node['uix_styling']);
			$viewParams = array(
				'node'	=> $node,
			);

			return $this->responseView('Audentio_UIX_ViewAdmin_Node_UIXOptions', 'uix_node_options', $viewParams);
		}
	}

	public function actionLayoutSave()
	{
		$this->_assertPostOnly();

		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::UINT);

		$layoutOptions = $this->_input->filterSingle('layout_options', array(XenForo_Input::ARRAY_SIMPLE, 'array' => true));

		$layoutOptionsJson = json_encode($layoutOptions);

		$writerData = array(
			'node_id'		=> $nodeId,
			'layout_data'	=> $layoutOptionsJson,
		);

		$layout = $this->_getLayoutModel()->getLayoutOptionsByNodeId($nodeId);

		$writer = XenForo_DataWriter::create('Audentio_UIX_DataWriter_NodeLayout');
		$writer->bulkSet($writerData);
		if ($layout)
		{
			$writer->setExistingData($nodeId);
		}
		$writer->save();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes'));
	}

	public function actionLayout()
	{
		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::INT);
		if ($nodeId == -1)
		{
			$nodeId = 10240;
		}
		$nodeModel = $this->_getNodeModel();
		$layoutModel = $this->_getLayoutModel();

		if (!$nodeId || $nodeId == 10240)
		{
			$layoutOptions = $layoutModel->getLayoutOptionsByNodeId($nodeId);
			if ($layoutOptions)
			{
				$layoutOptions = json_decode($layoutOptions['layout_data'], true);
			}
			if (!$nodeId)
			{
				$title = new XenForo_Phrase('uix_default_layout_options');
			}
			else
			{
				$title = new XenForo_Phrase('uix_category_layout_options');
			}
			$node = array(
				'node_id'			=> $nodeId,
				'title'				=> $title,
				'layout_options'	=> $layoutOptions,
			);
		}
		else
		{
			$node = $nodeModel->getNodeById($nodeId);
			if (!$node)
			{
				return $this->responseError(new XenForo_Phrase('uix_invalid_node_selected'));
			}
			if ($node['node_type_id'] != 'Category')
			{
				return $this->responseError(new XenForo_Phrase('uix_invalid_node_selected'));
			}
			$layoutOptions = $layoutModel->getLayoutOptionsByNodeId($nodeId);
			$node['layout_options'] = json_decode($layoutOptions['layout_data'], true);
		}

		$viewParams = array(
			'node'	=> $node,
		);

		return $this->responseView('Audentio_UIX_ViewAdmin_Node_Layout_Edit', 'uix_node_layout_edit', $viewParams);
	}

	protected function _getLayoutModel()
	{
		return $this->getModelFromCache('Audentio_UIX_Model_NodeLayout');
	}
}