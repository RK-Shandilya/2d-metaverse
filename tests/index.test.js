import axios from "axios"

const BACKEND_URL = "http://localhost:8000"

describe("Auth",()=>{
    test('User is able to Sign up only once', async ()=> {
        const username = "kirat" + Math.random();
        const password = 123456;
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: 'admin'
        })
        expect(response.statusCode).toBe(200);

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        })
        expect(updatedResponse.statusCode).toBe(400);
    })

    test('Signup fails if the username is empty', async()=> {
        const username = `Rudra-${Math.random()}`
        const password = 123456;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        });
        expect(response.statusCode).toBe(400);
    })

    test('Signin succeeds with correct credentials', async ()=> {
        const username = "Rudra" + Math.random();
        const password = 123456;

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: 'admin'
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    })

    test('Signin fails if the username and password are incorrect', async() => {
        const username = `kirat-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })

        expect(response.status).toBe(403)
    })
})

describe("User Update metadata Endpoint", ()=>{
    let token = null;
    let avatarId = "";

    beforeAll(async ()=>{
        const username = "Rudra" + Math.random();
        const password = 123456;
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: 'admin'
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        token = response.body.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/createAvatr`, {
            imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            name: 'Paaji'
        },{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        avatarId = avatarResponse.body.avatarId;
    })

    test("User can't update their metadata with a wrong avatar id", async()=> {
        const response = await axios.post(`${BACKEND_URL}/api/v1/updateUserMetadata`, {
            avatarId: 1234555
        },{
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(400)
    })

    test("User can update their metadata with the right avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/updateUserMetadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User is not able to update their metadata if the auth header is not present", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/updateUserMetadata`, {
            avatarId
        })

        expect(response.status).toBe(403)
    })
})

