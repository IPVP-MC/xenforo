<?php
class Audentio_UIX_ControllerAdmin_NodeLayoutSeparator extends XenForo_ControllerAdmin_NodeAbstract
{
	protected static $_nodeDataWriterName = 'Audentio_UIX_DataWriter_NodeLayoutSeparator';

	public function actionIndex()
	{
		return $this->responseReroute('XenForo_ControllerAdmin_Node', 'index');
	}

	public function actionAdd()
	{
		return $this->responseReroute(__CLASS__, 'edit');
	}

	public function actionEdit()
	{
		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::UINT);
		if ($nodeId)
		{
			$node = $this->_getNodeLayoutModel()->getLayoutOptionsByNodeId($nodeId);
			$node['layout_options'] = json_decode($node['layout_data'], true);
		}
		else
		{
			$node = array(
				'parent_node_id'	=> $this->_input->filterSingle('parent_node_id', XenForo_Input::UINT),
				'display_order'		=> 1,
				'display_in_list'	=> 1,
			);
		}

		$viewParams = array(
			'node'	=> $node,
			'nodeParentOptions' => $this->_getNodeModel()->getNodeOptionsArray($this->_getNodeModel()->getPossibleParentNodes($node), $node['parent_node_id'], true),
		);

		return $this->responseView('Audentio_UIX_ViewAdmin_NodeLayoutSeparator_Edit', 'uix_node_layout_separator_edit', $viewParams);
	}

	public function actionDeleteConfirm()
	{
		$separatorNodeModel = $this->_getNodeLayoutModel();
		$nodeModel = $this->_getNodeModel();

		$adNode = $separatorNodeModel->getLayoutOptionsByNodeId($this->_input->filterSingle('node_id', XenForo_Input::UINT));
		if (!$adNode)
		{
			return $this->responseError(new XenForo_Phrase('requested_node_not_found'), 404);
		}

		$childNodes = $nodeModel->getChildNodes($adNode);

		$viewParams = array(
			'node' => $adNode,
			'childNodes' => $childNodes,
			'nodeParentOptions' => $nodeModel->getNodeOptionsArray(
				$nodeModel->getPossibleParentNodes($adNode), $adNode['parent_node_id'], true
			)
		);

		return $this->responseView('Audentio_UIX_ViewAdmin_NodeLayoutSeparator_Delete', 'uix_node_layout_separator_delete', $viewParams);
	}

	public function actionSave()
	{
		$this->_assertPostOnly();
		$nodeId = $this->_input->filterSingle('node_id', XenForo_Input::UINT);

		if ($this->_input->filterSingle('deleteConfirm', XenForo_Input::STRING))
		{
			return $this->responseReroute(__CLASS__, 'delete');
		}

		$layoutOptions = $this->_input->filterSingle('layout_options', array(XenForo_Input::ARRAY_SIMPLE, 'array' => true));

		$layoutOptionsJson = json_encode($layoutOptions);

		$writerData = $this->_input->filter(array(
			'title'				=> XenForo_Input::STRING,
			'node_type_id'		=> XenForo_Input::BINARY,
			'parent_node_id'	=> XenForo_Input::UINT,
			'display_order'		=> XenForo_Input::UINT,
		));
		$writerData['display_in_list'] = 1;
		$writerData['style_id'] = 0;
		$writerData['layout_data'] = $layoutOptionsJson;

		$writer = $this->_getNodeDataWriter();
		if ($nodeId)
		{
			$writer->setExistingData($nodeId);
		}
		$writer->bulkSet($writerData);
		$writer->save();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('nodes'));
	}

	public function actionValidateField()
	{
		$response = parent::actionValidateField();

		return $response;
	}

	protected function _getNodeDataWriter()
	{
		return XenForo_DataWriter::create(self::$_nodeDataWriterName);
	}

	protected function _getNodeLayoutModel()
	{
		return $this->getModelFromCache('Audentio_UIX_Model_NodeLayout');
	}
}