import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:8100/api/v1";
const SAMPLE_AVATAR = path.join("public", "default-avatar.png");

const categories = [
    "food", "transport", "shopping", "utilities",
    "entertainment", "salary", "investment", "other"
];

const generateRandomAmount = () => parseFloat((Math.random() * 1000 + 10).toFixed(2));
const getRandomCategory = () => categories[Math.floor(Math.random() * categories.length)];
const getRandomType = () => (Math.random() > 0.5 ? "income" : "expense");
const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 1e9)).toISOString();

// 1. Create 10 users and store tokens
const USERS = Array.from({ length: 10 }, (_, i) => ({
    name: `User${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@test.com`,
    password: "Test@1234"
}));

const main = async () => {
    console.log("avatar file path:", SAMPLE_AVATAR);

    for (const user of USERS) {
        const form = new FormData();
        form.append("name", user.name);
        form.append("username", user.username);
        form.append("email", user.email);
        form.append("password", user.password);
        form.append("avatar", fs.createReadStream(SAMPLE_AVATAR));

        try {
            // console.log("formData:", form);cd

            const registerRes = await axios.post(`${BASE_URL}/users/signup`, form, {
                headers: form.getHeaders(),
            });
            console.log(`✅ Registered: ${user.email}`);
        } catch (err) {
            console.error(`❌ Registration failed for ${user.email}:`, err?.response?.data?.message || err.message);
            continue;
        }

        // 2. Login to get token (assuming login route exists at /login)
        try {
            const loginRes = await axios.post(`${BASE_URL}/users/login`, {
                email: user.email,
                password: user.password
            });

            const token = loginRes.data?.data?.accessToken;
            if (!token) {
                console.error(`❌ Token missing for ${user.email}`);
                continue;
            }

            console.log(`🔐 Logged in: ${user.email}`);

            // 3. Create 3-4 transactions per user
            const txnCount = Math.floor(Math.random() * 2) + 3;
            for (let i = 0; i < txnCount; i++) {
                try {
                    await axios.post(`${BASE_URL}/transactions`, {
                        amount: generateRandomAmount(),
                        type: getRandomType(),
                        category: getRandomCategory(),
                        date: getRandomDate(),
                        description: `Auto-generated transaction #${i + 1}`
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(`  ➕ Created transaction #${i + 1} for ${user.email}`);
                } catch (err) {
                    console.error(`  ❌ Transaction failed:`, err?.response?.data?.message || err.message);
                }
            }

            // 4. (Optional) Create 1-2 budgets
            const budgetsToCreate = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < budgetsToCreate; i++) {
                try {
                    await axios.post(`${BASE_URL}/budget`, {
                        category: getRandomCategory(),
                        amount: generateRandomAmount(),
                        month: new Date().getMonth(),
                        year: new Date().getFullYear()
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(`  📊 Created budget #${i + 1} for ${user.email}`);
                } catch (err) {
                    console.error(`  ❌ Budget failed:`, err?.response?.data?.message || err.message);
                }
            }

        } catch (err) {
            console.error(`❌ Login failed for ${user.email}:`, err?.response?.data?.message || err.message);
        }
    }
};

main();
