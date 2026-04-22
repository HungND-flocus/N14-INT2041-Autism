import soundfile as sf
import numpy as np
from sherpa_onnx import OfflineRecognizer
from pathlib import Path
import os
import difflib
import difflib
from utils import normalize_vn

CURRENT_DIR = Path(__file__).parent.absolute()

class SpeechModel():
    def __init__(self):
        os.environ.pop("SSL_CERT_FILE", None)
        print("Loading speech to text model.")

        
        # load the curr folder
        self.recognizer = OfflineRecognizer.from_transducer(
            encoder=str(CURRENT_DIR / "models/stt/encoder-epoch-20-avg-10.int8.onnx"),
            decoder=str(CURRENT_DIR / "models/stt/decoder-epoch-20-avg-10.int8.onnx"),
            joiner=str(CURRENT_DIR / "models/stt/joiner-epoch-20-avg-10.int8.onnx"),
            tokens=str(CURRENT_DIR / "models/stt/config.json"),      
            modeling_unit="bpe",                   
            bpe_vocab=str(CURRENT_DIR / "models/stt/bpe.model"),    
            num_threads=4,
        )
        print("Loaded speech to text model.")

    # dung de dich tu audio sang text
    def transcribe(self, file_path):
        file_path = str(CURRENT_DIR/file_path)
        audio, sr = sf.read(file_path)
        #can creates multiple stream at once
        stream = self.recognizer.create_stream()
        stream.accept_waveform(sr, audio)
        self.recognizer.decode_stream(stream)
        return stream.result.text
    

    def compare(self, expected : str, actual: str):
        expected_words = normalize_vn(expected).strip().lower().split()
        actual_words = normalize_vn(actual).strip().lower().split()
        
        matcher = difflib.SequenceMatcher(None, expected_words, actual_words)
        
        results = []
        for opcode, i1, i2, j1, j2 in matcher.get_opcodes():
            #True, False
            status = True if opcode == "equal" else False
            for word in expected_words[i1:i2]:
                results.append((word, status))
        # return xem tu nao dung + score
        correct = sum( [ 1 if status else 0 for _, status in results ])
        score = correct / len(expected_words) if expected_words else 0
        return results, score
    def evaluate(self, file_path: str, expect: str):
        actual = self.transcribe(file_path)
        results, score = self.compare(expected, actual)

class TextModel():
    def __init__(self):
        return 

if __name__ =="__main__":
    sm = SpeechModel()

    file_path = "wavs/0.wav"
    expected = " TÔN KÍNH LINH HAY LÀ HỌ LÀ NHỮNG CON NGƯỜI SỐNG CÔ QUẠNH BIỆT LẬP HOANG DÃ NHƯ NHỮNG BẦY THÚ Ở TRONG RỪNG CHÚNG TA CHẲNG NÊN BỎ QUA MÀ KHÔNG ĐẾN THĂM HỎI TÌM HIỂU"
    actual = sm.transcribe("wavs/0.wav")
    print(sm.compare(actual=actual, expected= expected))