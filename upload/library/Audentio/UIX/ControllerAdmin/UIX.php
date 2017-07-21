<?php
class Audentio_UIX_ControllerAdmin_UIX extends XenForo_ControllerAdmin_Abstract
{
	public function actionIndex()
	{
		return $this->responseView('Audentio_UIX_ViewAdmin_UIX_Splash', 'uix_splash');
	}

	public function actionDismiss()
	{
		$update = $this->getModelFromCache('XenForo_Model_DataRegistry')->get('uix_update');
		$update['show_notice'] = 0;

		$this->getModelFromCache('XenForo_Model_DataRegistry')->set('uix_update', $update);

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('index'));
	}

	public function actionClearApiKey()
	{
		$writer = XenForo_DataWriter::create('XenForo_DataWriter_Option');
		$writer->setExistingData('uix_apiKey');
		$writer->set('option_value', ' ');
		$writer->save();

		$option = $writer->getMergedData();

		return $this->responseRedirect(XenForo_ControllerResponse_Redirect::SUCCESS, XenForo_Link::buildAdminLink('options/list/uix'));
	}

	public function actionGenerateHashFile()
	{
		$fileExtensions = array('.php');
		$excludedFiles = array('library/Audentio/UIX/Hash.php');
		$hashes = XenForo_Helper_Hash::hashDirectory('library/Audentio/UIX', $fileExtensions, $excludedFiles);

		$hashFile = '<?php'."\n".'class Audentio_UIX_Hash'."\n".'{'."\n";
		$hashFile .= "\t".'public static $hashes = array('."\n";
		foreach ($hashes as $filePath=>$hash) {
			$hashFile .= "\t\t".'\''.$filePath.'\'=> \''.$hash.'\','."\n";
		}
		$hashFile .= "\t".');'."\n";
		$hashFile .= '}';

		echo ($hashFile);
		die;
	}

	public function actionCheckHashes()
	{
		$fileExtensions = array('.php');
		$excludedFiles = array('library/Audentio/UIX/Hash.php');
		$currentHashes = XenForo_Helper_Hash::hashDirectory('library/Audentio/UIX', $fileExtensions, $excludedFiles);
		$hashes = Audentio_UIX_Hash::$hashes;
		$nonMatches = array();

		foreach ($hashes as $filePath=>$hash) {
			if (!array_key_exists($filePath, $currentHashes)) {
				$nonMatches[] = $filePath;
			}

			$checkHash = $currentHashes[$filePath];
			if ($hash != $checkHash) {
				$nonMatches[] = $filePath;
			}
		}

		var_dump($nonMatches);die;
	}
}