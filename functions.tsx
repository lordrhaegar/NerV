import { HfInference } from "@huggingface/inference";
import * as FileSystem from "expo-file-system"
import axios from 'axios'
const apiKey = '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';
const url = 'https://api.openai.com/v1/audio/speech';
export const query = async (hf: HfInference, setBase64: Function, text: string): Promise<String> => {
    try {
        const response = await hf.textToSpeech({
            model: 'facebook/mms-tts',
            inputs: text
          })
          console.log("response>>>", response);
          
          const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(response);
            fileReaderInstance.onload = () => {
            const base64 = fileReaderInstance.result
            const data = base64?.split(",")[1]
            console.log(data)
        }
    } catch (error) {
        console.error("Error reading>>", error);
        
    }
    
}

export const convertTextToSpeech = async (textToConvert: string) => {

    const apiKey = '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';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: textToConvert,
            voice: 'alloy',
            language: 'da',
        })
    };
    try {
        const response = await fetch(url, requestOptions)
        return response.blob()
    } catch (error) {
        console.error("Error", error?.response)
    }
};

export const generateAudio = async (text: string)=>{
    try {
        const response = await axios.post(
            `${url}`,
            {
                model: 'tts-1',
                input: text,
                voice: 'alloy',
                response_formet: 'mp3'
            },
            {
                headers:{
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            },
        )
        const audioBuffer = Buffer.from(response.data)
        const base64Audio = audioBuffer.toString()
        return `data:audio/mp3;base64,${base64Audio}`
    } catch (error) {
        console.error("Error decoding audo:", error.response)
    }
}

// import OpenAI from 'openai';

// const openai = new OpenAI({
//     apiKey: apiKey
// });



// export async function generateAudio(text: string) {
//     try {
//         const mp3 = await openai.audio.speech.create({
//           model: "tts-1",
//           voice: "alloy",
//           input: text,
//         });
//         const buffer = Buffer.from(await mp3.arrayBuffer());
//       //   return `data:audio/mp3;base64,${buffer.toString("base64")}`;
//       return buffer
//       //   await FileSystem.promises.writeFile(speechFile, buffer);
//     } catch (error) {
//         console.error("Error generating audio:", error)
//     }
// }
