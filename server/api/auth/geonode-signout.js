import { getToken } from '#auth'


export default defineEventHandler(async (event) => {
     const token = await getToken(event)
     console.log('geonode-signout.js token:', token);
});


