import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Circle, Defs, Path, RadialGradient, Stop, Svg } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { convertTextToSpeech, generateAudio, query } from '../functions';
import { HfInference } from '@huggingface/inference'
import {Audio} from 'expo-av'
import axios from 'axios';


type Props = NativeStackScreenProps<RootStackParamList, "NerV">;
const { height, width } = Dimensions.get("window")
const NerV: React.FC<Props> = () => {
    const hf = new HfInference("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")
    const [base64, setBase64] = useState("")
        const [sound, setSound] = useState(null)
//     useEffect(()=>{
//         const greeting = "Hello, i am barth. How are you?"
//         const generateAudioHandler = async()=>{
//             await query(hf, setBase64, greeting)
//         }
//         generateAudioHandler()
// },[])
useEffect(()=>{
    async function fetchAndPlayAudio() {
        try {
          // Fetch the base64 encoded audio data from your API
          const response = await axios.post('https://b4f0-34-138-209-31.ngrok-free.app/speak', {
            input_text: "Hello, i am barth. How are you?"
          },
        {
            headers:{
                'Content-Type': 'application/json'
  
            }
        });
          const base64String = await response.data?.audio_base64;
          
    
            const binaryString = atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
        
            // Create a Blob from the byte array
            const blob = new Blob([bytes], { type: 'audio/mpeg' });
        
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
        
            // Load and play the audio using expo-av
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            await sound.playAsync();
        
            // Revoke the object URL after the sound is loaded
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.didJustFinish) {
                URL.revokeObjectURL(url);
              }
            });
          } catch (error) {
            console.error('Error fetching or playing audio:', error);
          }
        }
        
        // Call the function to fetch and play the audio
        fetchAndPlayAudio();
    
},[base64])


    return (

            <View style={[{backgroundColor: "black", height: "100%", alignItems: 'center',
                justifyContent: 'center'}]}>
                <MotiView
                    from={{
                        rotate: '0deg',
                        scale: 1,
                        opacity: 0.5,
                    }}
                    animate={{
                        rotate: '360deg',
                        scale: 1.2,
                        opacity: 1,
                    }}
                    transition={{
                        type: 'timing',
                        duration: 2000,
                        loop: true
                    }}
                    style={styles.container}
                >

                    <Svg height="40%" width="40%">
                        <Defs>
                            <RadialGradient
                                id="grad"
                                cx="50%"
                                cy="50%"
                                r="60%"
                                fx="50%"
                                fy="50%"
                            >
                                <Stop offset="0%" stopColor="black" />
                                <Stop offset="50%" stopColor="#16392f" />
                                <Stop offset="100%" stopColor="lightgreen" />
                            </RadialGradient>
                        </Defs>
                        <Circle
                            cx="50%"
                            cy="50%"
                            r="25%"
                            fill="url(#grad)"
                            style={styles.glowCircle}
                        />
                    </Svg>
                </MotiView>
            </View>


    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'

    },
    glowCircle: {
        shadowColor: 'lightgreen',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 20,
    },
    statusText: {
        fontSize: 18,
        color: '#3498db',
    },
});



export default NerV;