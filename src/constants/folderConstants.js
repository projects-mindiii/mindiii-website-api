
/**
 * Folder Constants
 *
 * @package                Mindiii
 * @subpackage             Folder Constants
 * @category               Constants
 * @ShortDescription       This is responsible for folder constants
 */


const basePath = process.env.ADMIN_URL_BASE

const folderConstants = {
    "BANNER_IMAGE": `${basePath}/uploads/portfolio/`,
    "WEB_IMAGE": `${basePath}/uploads/appImage/`,
    "APP_IMAGE": `${basePath}/uploads/webImage/`,
    "GALLERY_IMAGE": `${basePath}/uploads/pictures/`

};

export default folderConstants;