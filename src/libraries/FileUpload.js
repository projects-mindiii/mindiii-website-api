import _ from 'lodash';
import fs from "fs"
import AWS from "aws-sdk"
import path from "path"
import commonConstants from '~/constants/commonConstants';
/**
 * File Upload Library
 */

// initialize digital ocean space
// const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
const spacesEndpoint = new AWS.Endpoint('https://sgp1.digitaloceanspaces.com/images');
// const s3 = new AWS.S3({
//     endpoint: spacesEndpoint,
//     accessKeyId: process.env.SPACES_KEY,
//     secretAccessKey: process.env.SPACES_SECRET
// });
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: "MD5Z5T4XMBQMOEVGDHHS",
    secretAccessKey: "iIzGtmFiRcN657NmA9mMoPf3dsHsPHLm/Zsi74buy+o"
});

export default class FileUpload {
    /**
     * Upload File.
     *
     * @param  req request param
     * @param  folder upload file folder 
     * @returns {object} uploaded file name
     */
    async uploadFile(req, folder = 'avatars') {

        var files;
        var fileNames = []; //initialize return file name array 

        var file = req.file.filename; //get file name from file data
        var matches = file.match(/^(.+?)_.+?\.(.+)$/i);

        if (matches) { //check for responsive file for multiple file size

            files = _.map(['lg', 'md', 'sm'], function(size) {
                return matches[1] + '_' + size + '.' + matches[2];
            });

        } else { // upload original file 

            files = [file];
        }

        // check upload in local or cloud
        files = _.map(files, function(file) {

            var port = req.app.get('port'); //get port from request data 

            var base = req.protocol + '://' + req.hostname + (port ? ':' + port : ''); //create base url using request data

            var url = path.join(req.file.baseUrl, file).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');
            //create full path of file

            return (req.file.storage == commonConstants.FILE_UPLOAD_STORAGE_TYPE ? base : '') + '/' + url; //return file  url

        });

        /* check file will upload in cloud server or Not*/
        if (commonConstants.IS_FILE_UPLOAD_CLOUD == 'true') {

            let localPath = '.' + files[0]; //get file url 

            const fileStream = fs.createReadStream(localPath); //create uploaded file stream for params 

            // set params for upload file in cloud(digital ocean space)
            var params = {
                Body: fileStream,
                ContentType: req.file.mimetype,
                // Bucket: process.env.BUCKET_NAME,
                Bucket: 'crave',
                Key: req.file.filename,
                // ACL: process.env.BUCKET_ACL
                ACL: "public-read"
            };

            //upload file in cloud(digital ocean space)
            await s3.putObject(params, function(err, data) {
                if (err) {
                    // console.log('err', err)
                    // return false when file not upload in cloude
                    return false;
                }
                // console.log('data', data)
            });

            // Unlink file from local storage when uploaded in cloud
            this.unlinkFile(file, folder);
        }

        // add file name in return data
        fileNames.push(file);
        return fileNames;

    }

    /**
     * Upload Multiple File.
     *
     * @param {object} fileArray request param
     * @param {string} folder upload file folder
     * @returns {object} uploaded file name
     */

    uploadMultipleFile(fileArray, folder = 'avatars') {

        var fileNames = []; //initialize return file name array 

        // start process for get file name and upload file in cloud 
        fileArray.files.forEach(element => {

            var files;

            var fileData = element; //set file object 

            var file = fileData.filename; //get file name from file object

            var matches = file.match(/^(.+?)_.+?\.(.+)$/i);

            if (matches) { //check for responsive file for multiple file size

                files = _.map(['lg', 'md', 'sm'], function(size) {
                    return matches[1] + '_' + size + '.' + matches[2];
                });

            } else { // upload original file 

                files = [file];
            }

            // check upload in local or cloud
            files = _.map(files, function(file) {

                var port = fileArray.app.get('port'); //get port from request data 

                var base = fileArray.protocol + '://' + fileArray.hostname + (port ? ':' + port : ''); //create base url using request data

                var url = path.join(fileData.baseUrl, file).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, ''); //create full path of file

                return (fileData.storage == commonConstants.FILE_UPLOAD_STORAGE_TYPE ? base : '') + '/' + url; //return file  url 

            });

            /* check file will upload in cloud server or Not*/
            if (commonConstants.IS_FILE_UPLOAD_CLOUD == 'true') {

                let localPath = '.' + files[0]; //get file url 

                const fileStream = fs.createReadStream(localPath); //create uploaded file stream for params 

                // set params for upload file in cloud(digital ocean space)
                var params = {
                    Body: fileStream,
                    ContentType: fileData.mimetype,
                    Bucket: process.env.BUCKET_NAME,
                    Key: fileData.filename,
                    ACL: process.env.BUCKET_ACL
                };

                //upload file in cloud(digital ocean space)
                s3.putObject(params, function(err, data) {

                    if (err) {
                        // return false when file not upload in cloude
                        return false;
                    }
                });

                // Unlink file from local storage when uploaded in cloud
                this.unlinkFile(fileData.filename, folder);

            }

            // add file name in return data
            fileNames.push(fileData.filename);

        });

        // return files name
        return fileNames;
    }


    /**
     * File unlink.
     *
     * @param  {String} fileName
     * @param  {String} folder
     * @returns {Boolean} return
     */
    unlinkFile(fileName, folder) {


        const directory = commonConstants.STORAGE_PATH + folder,
            path = `${directory}/${fileName}`;
        fs.unlink(path, (err) => {
            if (err) {

                return false;
            }

            return true;
            // file removed
        });
    }


    /**
     * File unlink using file path with name.
     *
     * @param  {String} filePath
     * @returns {Boolean}
     */
    unlinkFileUsingPath(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                // console.error(err);

                return false;
            }

            return true;
            // file removed
        });
    }

    /**
     * File unlink using file name from digital ocean.
     *
     * @param {String} fileName 
     * @returns {Boolean} return
     */
    async removeFileFromDigitalOcean(fileName) {

        // Specifies a path within your Space and the file to delete.
        const bucketParams = {
            // Bucket: process.env.BUCKET_NAME,
            Bucket: 'crave',
            Key: fileName

        };
        //Call s3 delete method 
        await s3.deleteObject(bucketParams, function(err, data) {

            if (err) {

                return false;
            }
        });

        return true;

    }


}