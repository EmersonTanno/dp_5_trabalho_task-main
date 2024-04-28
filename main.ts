import App from "./app";

async function main() {
    const app = App.getInstance();
    await App.startDatabase();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}

main();
