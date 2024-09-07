export default defineEventHandler(async (event) => {
    // Obtén los datos de la solicitud, incluyendo el token a revocar
    const body = await readBody(event);

    const refreshTokenRevoke = body.token.refresh_token;
    const accessTokenRevoke = body.token.access_token;

    console.log("refreshTokenRevoke", refreshTokenRevoke);
    console.log("accessTokenRevoke", accessTokenRevoke);

    // URL del endpoint para revocar el token en Django OAuth Toolkit
    const revokeTokenURL = `${process.env.NUXT_GEONODE_BASEURL}/o/revoke_token/`;
    const clientId = `${process.env.NUXT_GEONODE_CLIENT_ID}`;         // Obtén el client_id de forma segura
    const clientSecret = `${process.env.NUXT_GEONODE_CLIENT_SECRET}`; // Obtén el client_secret de forma segura

    // Hacer la solicitud desde el servidor para revocar el token
    try {

        const responseRevokeToken = await $fetch(revokeTokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                token: refreshTokenRevoke,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        console.log("response", responseRevokeToken);

        // Devolver la respuesta al cliente
        return {success: true, message: 'Token revocado con éxito'};
    } catch (error) {
        console.log("error", error);
        return {success: false, message: 'Error al revocar el token', error};
    }
});
