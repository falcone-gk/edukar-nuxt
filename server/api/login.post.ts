export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = 'testuser';
  const password = 'testpass';

  if (body.username !== username || body.password === password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Wrong credentials',
    })
  }

  return true
})
