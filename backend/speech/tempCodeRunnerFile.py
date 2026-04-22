    # expected = "tôn kính thần là những con người sống cô quạnh biệt lập hoang dã như những bầy thú ở trong rừng chúng ta chẳng nên bỏ qua mà không đến thăm hỏi tìm hiểu"

    # matcher = difflib.SequenceMatcher(None, expected, actual)
    # ratio = matcher.ratio()  # 0.0 to 1.0, higher is better

    # # per-character diff
    # for opcode, i1, i2, j1, j2 in matcher.get_opcodes():
    #     if opcode == "equal":
    #         print(f"✅ {expected[i1:i2]}")
    #     else:
    #         print(f"❌ expected '{expected[i1:i2]}' got '{actual[j1:j2]}'")