import { spawn } from "child_process";
import path from "path";

export const retrieveContext = (meetingId, question) => {
    return new Promise((resolve, reject) => {

        const python = spawn("python", [
            path.join("ai", "retrieve.py"),
            question,
            meetingId
        ]);

        let output = "";
        let error = "";

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            error += data.toString();
        });

        python.on("close", (code) => {

            if (code !== 0) {
                return reject(error);
            }

            try {
                resolve(JSON.parse(output));
            } catch (err) {
                reject(err);
            }

        });

    });
};