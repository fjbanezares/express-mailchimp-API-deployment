const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
    apiKey: "969f7e2640959b0e6af1c178efc97d2a-us12",
    server: "us12",
});

const run = async () => {
    const response = await client.lists.getAllLists();
    console.log(response);
};

run();
