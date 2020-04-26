import env from 'dotenv';
env.config();
import cors from 'cors';
import express from 'express';
import path from 'path';
import apiRoute from './routes/api';
import ShriApiClient from "./src/ShriApiClient";
import GitCommand from './src/GitCommand';
import {Request, Response} from 'express-serve-static-core';
import Store from "./utils/Store";

const app = express();

ShriApiClient.getConf()
    .then((response) => {
        if (response.data !== undefined) {
            Store.set({...response.data, lastCommit: Store.dataStore.lastCommit});

            GitCommand.getFirstCommit()
                .then((res) => {
                    Store.dataStore.lastCommit = res.commitHash;
                    GitCommand.setWatcher();
                });
        }
    });

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', apiRoute);

app.use((req: Request, res: Response) => {
        res.status(404);

        if (req.accepts("html")) {
            res.send("<h1>404 Not found</h1>");
            return;
        }
        if (req.accepts("application/json")) {
            res.json({error: "Not found"});
            return;
        }
        res.type("txt").send("Not found");
    }
);

app.listen(process.env.PORT, () => {
    console.log('listen port', process.env.PORT);
});
export {app};