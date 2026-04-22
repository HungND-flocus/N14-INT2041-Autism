import unicodedata
#class normalize ve dung NFC de no ko bi tach ra thanh cac character rieng
def normalize_vn(text):
    return unicodedata.normalize('NFC', text.lower())