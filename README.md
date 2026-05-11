# FluencyPlus 🚀
Dự án hỗ trợ luyện nói cho trẻ em (Tên cũ: SpeechSpark).

## Cấu trúc dự án
- `frontend/public/`: Chứa giao diện người dùng (HTML/JS thuần).
- `backend/js/`: Logic frontend cũ (vẫn được sử dụng bởi các file HTML).
- `backend_api/`: Backend mới sử dụng FastAPI (Python).
- `database/`: Schema database.

## Hướng dẫn chạy dự án

### 1. Chạy Frontend
```bash
python -m http.server 8000
```
Truy cập: `http://localhost:8000/frontend/public/index.html`

### 2. Chạy Backend (FastAPI)
```bash
cd backend_api
pip install -r requirements.txt
python main.py
```
Tài liệu API (Swagger): `http://localhost:8000/docs`

## Công nghệ sử dụng
- **Frontend**: HTML5, Vanilla JS, Tailwind CSS.
- **Backend**: Python 3.11+, FastAPI, SQLModel, Supabase.
- **Database**: Supabase (PostgreSQL).
