const { CognitoJwtVerifier } = require('aws-jwt-verify');

const mapGroupsToPaths = [
  { path: '/POST/upload-url', group: 'BasicUser' },
  { path: '/GET/preview-url', group: 'BasicUser' },
  { path: '/GET/download-url', group: 'BasicUser' },
  { path: '/DELETE/delete-movie', group: 'BasicUser' },
  { path: '/GET/get-movie', group: 'BasicUser' },
  { path: '/GET/query-movies', group: 'BasicUser' },
  { path: '/PUT/put-movie', group: 'BasicUser' },
  { path: '/POST/post-subscription', group: 'BasicUser' },
  { path: '/PUT/put-subscription', group: 'BasicUser' },
];

function extractPathFromMethodArn(methodArn) {
  const arnParts = methodArn.split(':');

  const apiGatewayPart = arnParts[arnParts.length - 1];

  const apiGatewayParts = apiGatewayPart.split('/');

  const path = `/${apiGatewayParts.slice(2).join('/')}`;
  return path;
}

function generatePolicy(principalId, effect, resource) {
  if (!effect || !resource) return null;

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  };

  return {
    principalId: principalId,
    policyDocument: policyDocument
  };
}

exports.handler = async function (event) {
  console.log('Event:', JSON.stringify(event));

  const requestPath = extractPathFromMethodArn(event.routeArn);
  console.log('Request path:', requestPath);

  const existingPaths = mapGroupsToPaths.map((config) => config.path);

  if (!existingPaths.includes(requestPath)) {
    console.log('Invalid path');
    return {
      statusCode: 403,
      isAuthorized: false,
      body: JSON.stringify({ message: 'Invalid path' })
    };
  }

  const authHeader = event.identitySource[0];
  console.log(authHeader);
  if (!authHeader) {
    console.log('No auth header');
    return {
      statusCode: 401,
      isAuthorized: false,
      body: JSON.stringify({ message: 'No authorization header found' })
    };
  }

  const token = authHeader.split(' ')[1];
  const verifier = CognitoJwtVerifier.create({
    userPoolId: 'eu-central-1_QCJqZH9gR',
    tokenUse: 'access',
    clientId: 'jnuaqlhr1kb416ikofua705iv',
  });

  let payload;
  try {
    payload = await verifier.verify(token);
    console.log('Token is valid. Payload:', payload);
  } catch (error) {
    console.log('Token not valid!', error);
    return {
      statusCode: 401,
      isAuthorized: false,
      body: JSON.stringify({ message: 'Invalid token' })
    };
  }

  const matchingPathConfig = mapGroupsToPaths.find(
    (config) => requestPath === config.path
  );
  const userGroups = payload['cognito:groups'];
  if (userGroups.includes(matchingPathConfig.group)) {
    console.log("GOOOOOOOOOOD!");
    console.log(generatePolicy(payload.sub, 'Allow', event.methodArn));
    return {
      statusCode: 200,
      isAuthorized: true,
    };
  }

  return {
    statusCode: 403,
    isAuthorized: false,
    body: JSON.stringify({ message: 'User not authorized' })
  };
}
