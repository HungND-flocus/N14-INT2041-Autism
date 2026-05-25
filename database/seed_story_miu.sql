-- Seed data for story mode: miu-tim-bong-hoa-vang
-- Run this after database/schema.sql

INSERT INTO public.flashcards (id, word, language_code, image_url, audio_url)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'bong hoa', 'vi', 'https://placehold.co/400x400.jpg?text=Bong+hoa', NULL),
    ('11111111-1111-1111-1111-111111111102', 'qua bong', 'vi', 'https://placehold.co/400x400.jpg?text=Qua+bong', NULL),
    ('11111111-1111-1111-1111-111111111103', 'cai mu', 'vi', 'https://placehold.co/400x400.jpg?text=Cai+mu', NULL),
    ('11111111-1111-1111-1111-111111111104', 'quyen sach', 'vi', 'https://placehold.co/400x400.jpg?text=Quyen+sach', NULL),
    ('11111111-1111-1111-1111-111111111105', 'ong', 'vi', 'https://placehold.co/400x400.jpg?text=Ong', NULL),
    ('11111111-1111-1111-1111-111111111106', 'ca', 'vi', 'https://placehold.co/400x400.jpg?text=Ca', NULL),
    ('11111111-1111-1111-1111-111111111107', 'chim', 'vi', 'https://placehold.co/400x400.jpg?text=Chim', NULL),
    ('11111111-1111-1111-1111-111111111108', 'cho', 'vi', 'https://placehold.co/400x400.jpg?text=Cho', NULL),
    ('11111111-1111-1111-1111-111111111109', 'ngam', 'vi', 'https://placehold.co/400x400.jpg?text=Ngam', NULL),
    ('11111111-1111-1111-1111-111111111110', 'tron', 'vi', 'https://placehold.co/400x400.jpg?text=Tron', NULL),
    ('11111111-1111-1111-1111-111111111111', 'ngu', 'vi', 'https://placehold.co/400x400.jpg?text=Ngu', NULL),
    ('11111111-1111-1111-1111-111111111112', 'chay', 'vi', 'https://placehold.co/400x400.jpg?text=Chay', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (id, slug, title, description, target_language, reward_sticker, next_story_slug, is_published)
VALUES (
    '22222222-2222-2222-2222-222222222201',
    'miu-tim-bong-hoa-vang',
    'Miu tim bong hoa vang',
    'Cau chuyen ngan giup tre nghe, dien tu va ke tiep noi dung.',
    'vi',
    'Hoa huong duong vui ve',
    'gau-nau-di-sieu-thi',
    true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.story_pages (
    id,
    story_id,
    page_number,
    title,
    caption,
    illustration_emoji,
    illustration_title,
    illustration_caption
)
VALUES
    (
        '33333333-3333-3333-3333-333333333301',
        '22222222-2222-2222-2222-222222222201',
        1,
        'Miu buoc ra vuon',
        'Buoi sang, Miu nghe mui hoa thom thoang qua.',
        '🐱',
        'Miu buoc ra vuon',
        'Buoi sang, Miu nghe mui hoa thom thoang qua.'
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        '22222222-2222-2222-2222-222222222201',
        2,
        'Ban ong bay toi',
        'Miu vung vay khi nghe tieng vo ve rat nho.',
        '🐝',
        'Ban ong bay toi',
        'Miu vung vay khi nghe tieng vo ve rat nho.'
    ),
    (
        '33333333-3333-3333-3333-333333333303',
        '22222222-2222-2222-2222-222222222201',
        3,
        'Miu biet se chia',
        'Miu mim cuoi va moi ban cung ngam hoa.',
        '🤝',
        'Miu biet se chia',
        'Miu mim cuoi va moi ban cung ngam hoa.'
    )
ON CONFLICT (story_id, page_number) DO NOTHING;

INSERT INTO public.story_blanks (
    id,
    story_page_id,
    blank_order,
    prompt_text,
    segment_before,
    segment_after,
    correct_flashcard_id,
    distractor_1_id,
    distractor_2_id,
    distractor_3_id
)
VALUES
    (
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333301',
        1,
        'Miu nhin thay gi trong vuon?',
        'Buoi sang, Miu di ra vuon va thay mot ',
        ' vang dang lung linh duoi nang.',
        '11111111-1111-1111-1111-111111111101',
        '11111111-1111-1111-1111-111111111102',
        '11111111-1111-1111-1111-111111111103',
        '11111111-1111-1111-1111-111111111104'
    ),
    (
        '44444444-4444-4444-4444-444444444402',
        '33333333-3333-3333-3333-333333333302',
        1,
        'Ban nao bay den choi voi Miu?',
        'Bat ngo, mot chu ',
        ' nho bay den va muon ngui mui hoa cung Miu.',
        '11111111-1111-1111-1111-111111111105',
        '11111111-1111-1111-1111-111111111106',
        '11111111-1111-1111-1111-111111111107',
        '11111111-1111-1111-1111-111111111108'
    ),
    (
        '44444444-4444-4444-4444-444444444403',
        '33333333-3333-3333-3333-333333333303',
        1,
        'Miu muon lam gi cung ban ong?',
        'Miu noi: chung minh cung ',
        ' bong hoa nay nhe!, roi hai ban cuoi that tuoi.',
        '11111111-1111-1111-1111-111111111109',
        '11111111-1111-1111-1111-111111111110',
        '11111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111112'
    )
ON CONFLICT (story_page_id, blank_order) DO NOTHING;
