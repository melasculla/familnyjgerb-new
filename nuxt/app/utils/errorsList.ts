export default {
   badRequest: { statusCode: 400, message: 'Bad request' },
   filename: { statusCode: 400, message: 'Wrong Filename' },
   unauthorized: { statusCode: 401, message: 'Unauthorized' },
   notFound: (instance: string = 'Page') => ({ statusCode: 404, message: `${instance} not Found` }),
   forbidden: { statusCode: 403, message: 'Forbidden' },
   conflict: { statusCode: 409, message: 'Resource already exists' },
   tokens: { statusCode: 500, message: 'Tokens doesn\'t created' },
}