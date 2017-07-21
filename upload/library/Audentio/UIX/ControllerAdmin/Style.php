<?php
class Audentio_UIX_ControllerAdmin_Style extends XFCP_Audentio_UIX_ControllerAdmin_Style
{
	public function actionIndex()
	{
		$xenOptions = XenForo_Application::getOptions();
		$response = parent::actionIndex();

		$adStyles = false;
		if ($xenOptions->uix_checkForUnassociatedStyles)
		{
			/** @var $registry XenForo_Model_DataRegistry */
			$registry = $this->getModelFromCache('XenForo_Model_DataRegistry');

			$startTime = $registry->get('uix_checkStylesStart');
			if ($startTime === null) $startTime = 0;
			if ($startTime > XenForo_Application::$time - 3600)
			{
				$styleModel = $this->_getStyleModel();
				$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');
				$apiStyles = $audentioModel->getStylesFromApi();
				if (is_array($apiStyles))
				{
					$adStyles = $styleModel->getAudentioStyles('uix_pid');
					$parsedStyles = array();
					foreach ($apiStyles as $apiStyle)
					{
						if ($apiStyle['purchased'] == 1) $parsedStyles[$apiStyle['name']] = $apiStyle['pid'];
					}

					foreach ($response->params['styles'] as &$style)
					{
						if (array_key_exists($style['title'], $parsedStyles) && $style['parent_id'] == 0 && !array_key_exists($parsedStyles[$style['title']], $adStyles))
						{
							$style['unassociated'] = true;
							$style['unassociated_pid'] = $parsedStyles[$style['title']];
						}
					}
				}
			}
			else
			{
				$writer = XenForo_DataWriter::create('XenForo_DataWriter_Option');
				$writer->setExistingData('uix_checkForUnassociatedStyles');
				$writer->set('option_value', 0);
				$writer->save();
			}
		}

		$response->params['outdatedTemplates'] = $this->_getTemplateModel()->getOutdatedTemplates();
		$response->params['adStyles'] = $adStyles;
		return $response;
	}

	public function actionTemplates()
	{
		$response = parent::actionTemplates();
		if ($response instanceof XenForo_ControllerResponse_View) {
			$response->params['outdatedTemplates'] = $this->_getTemplateModel()->getOutdatedTemplates();
		}

		return $response;
	}

	public function actionUixSync()
	{
		$styleModel = $this->_getStyleModel();

		$styleId = $this->_input->filterSingle('style_id', XenForo_Input::UINT);
		$pid = $this->_input->filterSingle('pid', XenForo_Input::UINT);

		$style = $styleModel->getStyleById($styleId);
		$check = $styleModel->getAudentioStyleByPid($pid);
		if ($check)
		{
			return $this->responseError(new XenForo_Phrase('uix_a_style_is_already_associated_with_this_product'));
		}

		if ($style['audentio'])
		{
			return $this->responseError(new XenForo_Phrase('uix_this_style_is_already_associated_with_a_product'));
		}

		if ($this->isConfirmedPost())
		{
			$writerData = array(
				'audentio'				=> 1,
				'uix_pid'				=> $pid,
				'uix_version'			=> 0,
				'uix_update_available'	=> 1,
			);

			$writer = XenForo_DataWriter::create('XenForo_DataWriter_Style');
			$writer->bulkSet($writerData);
			$writer->setExistingData($styleId);
			$writer->save();

			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('styles'));
		}
		else
		{
			$viewParams = array(
				'style'	=> $style,
				'pid'	=> $pid,
			);
			return $this->responseView('Audentio_UIX_ViewAdmin_Style_UIXSync', 'uix_style_sync', $viewParams);
		}
	}
}

if (false)
{
	class XFCP_Audentio_UIX_ControllerAdmin_Style extends XenForo_ControllerAdmin_Style {}
}