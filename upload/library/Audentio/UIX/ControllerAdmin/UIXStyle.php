<?php
class Audentio_UIX_ControllerAdmin_UIXStyle extends XenForo_ControllerAdmin_Abstract
{
	public function actionIndex()
	{
		$styleModel = $this->_getStyleModel();

		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');

		$styles = $audentioModel->getStylesFromApi();

		if ($styles == 'ERR_NO_CURL')
		{
			return $this->responseError(new XenForo_Phrase('uix_no_curl'));
		}

		if ($styles == 'ERR_INVALID_API_KEY')
		{
			return $this->responseError(new XenForo_Phrase('uix_invalid_api_key'));
		}

		if (!is_array($styles))
		{
			return $this->responseError(new XenForo_Phrase('uix_an_unknown_error_has_occurred'));
		}

		$availableUpdates = 0;

		foreach ($styles as &$style)
		{
			$installed = $styleModel->getAudentioStyleByPid($style['pid']);
			if ($installed && $installed['uix_version'] != $style['product_version'] && !$installed['uix_update_available'])
			{
				$writer = XenForo_DataWriter::create('XenForo_DataWriter_Style');
				$writer->setExistingData($installed['style_id']);
				$writer->set('uix_update_available', 1);
				$writer->save();

				$installed = $writer->getMergedData();
			}

			if ($installed['uix_update_available'])
			{
				++$availableUpdates;
			}
			$style['installed'] = $installed;
		}

		$viewParams = array(
			'styles' => $styles,
			'totalStyles' => count($styles) + ($styleModel->showMasterStyle() ? 1 : 0),
			'availableUpdates'  => $availableUpdates,
		);

		return $this->responseView('Audentio_UIX_ViewAdmin_AudentioStyle_List', 'uix_style_list', $viewParams);
	}

	public function actionOutdated()
	{
		$styleModel = $this->_getStyleModel();

		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');

		$styles = $audentioModel->getStylesFromApi();

		if ($styles == 'ERR_INVALID_API_KEY')
		{
			return $this->responseError(new XenForo_Phrase('uix_invalid_api_key'));
		}

		foreach ($styles as &$style)
		{
			$style['installed'] = $styleModel->getAudentioStyleByPid($style['pid']);
		}

		$viewParams = array(
			'styles' => $styles,
			'totalStyles' => count($styles) + ($styleModel->showMasterStyle() ? 1 : 0)
		);

		return $this->responseView('Audentio_UIX_ViewAdmin_AudentioStyle_Outdated_List', 'uix_style_outdated_list', $viewParams);
	}

	public function actionDismiss()
	{
		$styleId = $this->_input->filterSingle('style_id', XenForo_Input::UINT);
		$version = $this->_input->filterSingle('version', XenForo_Input::STRING);

		$writer = XenForo_DataWriter::create('XenForo_DataWriter_Style');
		$writer->setExistingData($styleId);
		$writer->set('uix_latest_version', $version);
		$writer->set('uix_update_available', 0);
		$writer->save();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('uix-styles/outdated'));
	}

	public function actionUpdateAll()
	{
		$pid = $this->_input->filterSingle('pid', XenForo_Input::UINT);

		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');

		$product = $audentioModel->getStyleFromApi($pid);
		$style = $this->_getStyleModel()->getAudentioStyleByPid($pid);

		$requireFtp = false;
		if (!is_writable(getcwd().DIRECTORY_SEPARATOR.'styles'.DIRECTORY_SEPARATOR) || !is_writable(getcwd().DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR))
		{
			$requireFtp = true;
		}

		$viewParams = array(
			'requireFtp'	=> $requireFtp,
			'product'		=> $product,
			'style'			=> $style,
		);

		return $this->responseView('Audentio_UIX_AudentioStyle_UpdateAll_Confirm', 'uix_update_all_confirm', $viewParams);
	}

	public function actionUpdateNext()
	{
		$outdatedStyles = $this->_getStyleModel()->getOutOfDateAudentioStyles();
		if ($outdatedStyles)
		{
			$nextStyle = end($outdatedStyles);
			return $this->_startInstallation($nextStyle['uix_pid'], true);
		}
		else
		{
			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('styles'));
		}
	}

	public function actionForceReinstallAll()
	{
		$pid = $this->_input->filterSingle('pid', XenForo_Input::UINT);

		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');

		$product = $audentioModel->getStyleFromApi($pid);
		$style = $this->_getStyleModel()->getAudentioStyleByPid($pid);

		$requireFtp = false;
		if (!is_writable(getcwd().DIRECTORY_SEPARATOR.'styles'.DIRECTORY_SEPARATOR) || !is_writable(getcwd().DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR))
		{
			$requireFtp = true;
		}

		$viewParams = array(
			'requireFtp'	=> $requireFtp,
			'product'		=> $product,
			'style'			=> $style,
		);

		return $this->responseView('Audentio_UIX_AudentioStyle_ForceReinstallAll_Confirm', 'uix_force_reinstall_all_confirm', $viewParams);
	}

	public function actionForceReinstallNext()
	{
		$this->assertDebugMode();
		$this->_getStyleModel()->resetAllStyleVersions();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('uix-styles/update-next'));
	}

	public function actionInstall()
	{
		$pid = $this->_input->filterSingle('pid', XenForo_Input::UINT);

		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');

		if ($this->isConfirmedPost())
		{
			$updateAll = $this->_input->filterSingle('_updateAll', XenForo_Input::BOOLEAN);
			return $this->_startInstallation($pid, false);
		}
		else
		{
			$product = $audentioModel->getStyleFromApi($pid);
			$style = $this->_getStyleModel()->getAudentioStyleByPid($pid);
			$requireFtp = false;
			if (!is_writable(getcwd().DIRECTORY_SEPARATOR.'styles'.DIRECTORY_SEPARATOR) || !is_writable(getcwd().DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR))
			{
				$requireFtp = true;
			}

			$viewParams = array(
				'requireFtp'	=> $requireFtp,
				'product'		=> $product,
				'style'			=> $style,
			);

			return $this->responseView('Audentio_UIX_AudentioStyle_Install_Confirm', 'uix_style_install_confirm', $viewParams);
		}
	}

	public function _startInstallation($pid, $updateAll)
	{
		$audentioModel = $this->getModelFromCache('Audentio_UIX_Model_Audentio');
		$product = $audentioModel->getStyleFromApi($pid);
		$style = $this->_getStyleModel()->getAudentioStyleByPid($pid);

		if ($style)
		{
			$overwrite = $style['style_id'];
		}
		else
		{
			$overwrite = 0;
		}

		$return = $audentioModel->downloadStyleFromApi($pid);

		if (is_string($return))
		{
			switch($return)
			{
				case 'ERR_PRODUCT_NOT_PURCHASED':
					$msgPhrase = 'uix_product_not_purchased';
					break;
				case 'ERR_NO_LICENSE':
					$msgPhrase = 'uix_no_license';
					break;
				case 'ERR_LICENSE_EXPIRED':
					$msgPhrase = 'uix_license_expired';
					break;
				case 'ERR_NO_DOWNLOAD_FOR_YOUR_VERSION':
					$msgPhrase = 'uix_no_download_for_your_version';
					break;
				case 'ERR_HUB_OUTDATED':
					$msgPhrase = 'uix_your_uix_addon_is_outdated';
					break;
				default:
					$msgPhrase = $return;
					break;
			}

			return $this->responseError(new XenForo_Phrase($msgPhrase));
		}
		else
		{
			$session = XenForo_Application::getSession();

			$requireFtp = $this->_input->filterSingle('require_ftp', XenForo_Input::STRING);
			if ($requireFtp)
			{
				$host = $this->_input->filterSingle('ftp_host', XenForo_Input::STRING);
				$port = $this->_input->filterSingle('ftp_port', XenForo_Input::STRING);
				$user = $this->_input->filterSingle('ftp_user', XenForo_Input::STRING);
				$pass = $this->_input->filterSingle('ftp_pass', XenForo_Input::STRING);
				$path = $this->_input->filterSingle('ftp_path', XenForo_Input::STRING);
				$connect = $audentioModel->ftpConnect($host, $port, $user, $pass, $path);
				if (!$connect)
				{
					return $this->responseError(new XenForo_Phrase('uix_invalid_ftp_details'));
				}
			}

			$ftpPath = $this->_input->filterSingle('ftp_path', XenForo_Input::STRING);
			$dirName = 'adstyle-'.time();
			$dirPath = XenForo_Helper_File::getTempDir();

			$mkdir = $audentioModel->mkdir($dirPath, $requireFtp);
			$product = $audentioModel->getStyleFromApi($pid);
			$filePath = $audentioModel->filePath;

			$zip = new ZipArchive;
			$zip->open($filePath);
			for ($i=0;$i<$zip->numFiles;$i++)
			{
				$fileName = $zip->getNameIndex($i);
				$fileName = str_replace('\\', DIRECTORY_SEPARATOR, str_replace('/', DIRECTORY_SEPARATOR, $fileName));
				$fileParts = explode(DIRECTORY_SEPARATOR, $fileName);
				if ($fileParts[0] == 'Upload' || $fileParts[0] == 'upload' || strpos($fileParts[0], '.xml'))
				{
					$zip->extractTo($dirPath, array($zip->getNameIndex($i)));
					$realFile = $dirPath.DIRECTORY_SEPARATOR.$zip->getNameIndex($i);
					XenForo_Helper_File::makeWritableByFtpUser($realFile);
				}
			}
			$zip->close();
			unlink($filePath);

			if ($requireFtp)
			{
				$audentioModel->rmove($dirPath.DIRECTORY_SEPARATOR.'Upload'.DIRECTORY_SEPARATOR, $ftpPath, true);
			}
			else
			{
				$audentioModel->rmove($dirPath.DIRECTORY_SEPARATOR.'Upload'.DIRECTORY_SEPARATOR, getcwd());
			}

			$uixSession = array(
				'product'	=> $product,
				'dirPath'	=> $dirPath,
				'pid'		=> $pid,
				'overwrite'	=> $overwrite,
				'updateAll' => $updateAll,
			);
			$session->set('uix_install', $uixSession);
			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('uix-styles/install-step2'), '');
		}
	}

	public function actionInstallStep2()
	{
		$session = XenForo_Application::getSession();
		$uixSession = $session->get('uix_install');

		$dirPath = $uixSession['dirPath'];
		$product = $uixSession['product'];

		$xmlFile = $dirPath.DIRECTORY_SEPARATOR.'style-'.str_replace(' ', '-', $product['name']).'.xml';

		foreach(glob($dirPath.DIRECTORY_SEPARATOR.'*.xml') as $file)
		{
			$backupXmlFile = $file;
			break;
		}

		if (!file_exists($xmlFile))
		{
			$xmlFile = $backupXmlFile;
		}

		$input['overwrite_style_id'] = (int) $uixSession['overwrite'];
		$input['pid'] = $product['pid'];
		$input['version'] = $product['product_version'];

		$document = $this->getHelper('Xml')->getXmlFromFile($xmlFile);
		$style = $this->_getStyleModel()->importAudentioStyleXml($document, $input);

		$xenOptions = XenForo_Application::get('options')->getOptions();

		$writerData = array(
			'title'				=> substr(($xenOptions['boardTitle'] . ' - ' . $style['title']), 0, 50),
			'description'		=> '',
			'user_selectable'	=> 1,
			'parent_id'			=> $style['style_id'],
		);

		$uixSession['POSTDATA'] = $writerData;
		$session->set('uix_install', $uixSession);

		if ($uixSession['overwrite'])
		{
			$link = XenForo_Link::buildAdminLink('uix-styles/install-cleanup');
		}
		else
		{
			$link = XenForo_Link::buildAdminLink('uix-styles/install-step3');
		}

		return $this->responseRedirect(
			XenForo_ControllerResponse_Redirect::SUCCESS,
			$link
		);
	}

	public function actionInstallStep3()
	{
		$session = XenForo_Application::getSession();
		$uixSession = $session->get('uix_install');
		if (!$uixSession['overwrite'])
		{
			$dataId = $this->_input->filterSingle('data_id', XenForo_Input::STRING);

			$writerData = $uixSession['POSTDATA'];

			$writer = XenForo_DataWriter::create('XenForo_DataWriter_Style');
			$writer->bulkSet($writerData);
			$writer->save();
		}

		return $this->responseRedirect(
			XenForo_ControllerResponse_Redirect::SUCCESS,
			XenForo_Link::buildAdminLink('uix-styles/install-cleanup')
		);
	}

	public function actionInstallCleanup()
	{
		$session = XenForo_Application::getSession();
		$uixSession = $session->get('uix_install');
		$dirPath = $uixSession['dirPath'];
		$updateAll = $uixSession['updateAll'];
		$session->remove('uix_install');
		foreach(glob($dirPath.DIRECTORY_SEPARATOR.'*.xml') as $file)
		{
			unlink($file);
		}
		if ($updateAll)
		{
			return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('uix-styles/update-next'));
		}
		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('styles'));
	}

	protected function _checkCsrf($action)
	{
		if (strtolower($action) == 'child')
		{
			return;
		}

		parent::_checkCsrf($action);
	}

	protected function _getStyleModel()
	{
		return $this->getModelFromCache('XenForo_Model_Style');
	}
}