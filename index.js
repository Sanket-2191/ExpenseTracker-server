

import { ConnectDB } from "./src/db.js";
import { app } from "./src/server.js";


const port = process.env.PORT || 8100;


app.listen(port, () => {
    console.log("server running on port :", port);

    ConnectDB();

})