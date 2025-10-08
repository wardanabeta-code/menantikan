// Netlify Function for secure Cloudinary operations
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    let result;
    
    switch (event.httpMethod) {
      case 'DELETE':
        result = await handleDelete(event);
        break;
      case 'POST':
        result = await handleSignature(event);
        break;
      case 'GET':
        result = await handleList(event);
        break;
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Cloudinary API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      })
    };
  }
};

// Handle file deletion
async function handleDelete(event) {
  const { publicId } = JSON.parse(event.body || '{}');

  if (!publicId) {
    throw new Error('Public ID is required');
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { result };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

// Generate signed upload parameters
async function handleSignature(event) {
  const { folder, tags, transformation } = JSON.parse(event.body || '{}');

  const params = {
    timestamp: Math.round(new Date().getTime() / 1000),
    folder,
    ...(tags && { tags }),
    ...(transformation && { transformation })
  };

  try {
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      signature,
      timestamp: params.timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    };
  } catch (error) {
    console.error('Signature error:', error);
    throw new Error('Failed to generate signature');
  }
}

// List files in a folder
async function handleList(event) {
  const queryParams = new URLSearchParams(event.queryStringParameters || {});
  const folder = queryParams.get('folder');
  const resourceType = queryParams.get('resourceType') || 'image';

  if (!folder) {
    throw new Error('Folder parameter is required');
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .with_field('context')
      .with_field('tags')
      .max_results(30)
      .execute();

    return { resources: result.resources };
  } catch (error) {
    console.error('List error:', error);
    throw new Error('Failed to list files');
  }
}