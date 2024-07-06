
const apiGateway: string = "usxc9r50eg"

export const environment = {
    imageBase64:  'data:image/jpeg;base64,',
    userPoolId: 'eu-central-1_YJgBxTfaY',
    userPoolWebClientId: '',
    getUploadUrl: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/upload-url`,
    getMovie: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/get-movie`,
    getPreviewUrl: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/preview-url`,
    getDownloadUrl: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/download-url`,
    deleteMovie: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/delete-movie`,
    getAllMovies: `https://${apiGateway}.execute-api.eu-central-1.amazonaws.com/movies`,
}