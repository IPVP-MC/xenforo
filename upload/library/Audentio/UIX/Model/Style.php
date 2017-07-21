<?php
class Audentio_UIX_Model_Style extends XFCP_Audentio_UIX_Model_Style
{
	public function getAudentioStylesAsFlattenedTree($baseDepth = 0)
	{
		$styles = $this->getAudentioStyles();
		$tree = $this->getStyleTreeAssociations($styles);

		return $this->_buildFlattenedStyleTree($styles, $tree, 0, $baseDepth);
	}

	public function getAudentioStyleByPid($pid)
	{
		return $this->_getDb()->fetchRow('
			SELECT *
			FROM xf_style
			WHERE audentio=1
				AND uix_pid = ?
		', $pid);
	}

	public function getAudentioStyles($key='style_id')
	{
		return $this->fetchAllKeyed('
			SELECT *
			FROM xf_style
			WHERE audentio=1
		', $key);
	}

	public function getOutOfDateAudentioStyles()
	{
		return $this->fetchAllKeyed('
			SELECT *
			FROM xf_style
			WHERE audentio=1
				AND uix_update_available=1
		', 'style_id');
	}

	public function resetAllStyleVersions()
	{
		$this->_getDb()->query("
			UPDATE xf_style
			SET uix_update_available=1,
				uix_version='0.0.0'
			WHERE audentio=1");
	}

	public function importAudentioStyleXml(SimpleXMLElement $document, array $input = array())
	{
		$overwriteStyleId = $input['overwrite_style_id'];
		$pid = $input['pid'];
		$version = $input['version'];

		if ($document->getName() != 'style')
		{
			throw new XenForo_Exception(new XenForo_Phrase('provided_file_is_not_valid_style_xml'), true);
		}

		$title = (string)$document['title'];
		if ($title === '')
		{
			throw new XenForo_Exception(new XenForo_Phrase('provided_file_is_not_valid_style_xml'), true);
		}

		$description = (string)$document['description'];
		$addOnId = $document['addon_id'] === null ? null : (string)$document['addon_id'];

		/* @var $templateModel XenForo_Model_Template */
		$templateModel = $this->getModelFromCache('XenForo_Model_Template');

		/* @var $propertyModel XenForo_Model_StyleProperty */
		$propertyModel = $this->getModelFromCache('XenForo_Model_StyleProperty');

		if ($document['user_selectable'] === null)
		{
			$userSelectable = 1;
		}
		else
		{
			$userSelectable = (integer)$document['user_selectable'];
		}

		$db = $this->_getDb();
		XenForo_Db::beginTransaction($db);

		if ($overwriteStyleId)
		{
			$targetStyleId = $overwriteStyleId;
			$dw = XenForo_DataWriter::create('XenForo_DataWriter_Style');
			$dw->setExistingData($targetStyleId);
			$dw->bulkSet(array(
				'uix_version'				=> $version,
				'uix_update_available'	=> 0,
			));
			$dw->save();
		}
		else
		{
			$dw = XenForo_DataWriter::create('XenForo_DataWriter_Style');
			$dw->bulkSet(array(
				'title'				=> $title,
				'description'		=> $description,
				'parent_id'			=> 0,
				'user_selectable'	=> 0,
				'audentio'			=> 1,
				'uix_pid'			=> $pid,
				'uix_version'		=> $version,
			));
			$dw->save();

			$targetStyleId = $dw->get('style_id');
		}

		$templateModel->importTemplatesStyleXml($document->templates, $targetStyleId, $addOnId);
		$propertyModel->importStylePropertyXml($document->properties, $targetStyleId, $addOnId);

		XenForo_Application::defer('Template', array(), 'templateRebuild', true);

		XenForo_Db::commit($db);

		return $dw->getMergedData();
	}
}