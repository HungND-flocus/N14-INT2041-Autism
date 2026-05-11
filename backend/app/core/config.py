from pydantic_settings import BaseSettings
from typing import Optional
from urllib.parse import quote_plus

class Settings(BaseSettings):
    PROJECT_NAME: str = "FluencyPlus API"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Database
    DIRECT_URL: Optional[str] = None
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DB_HOST: str = ""
    DB_PORT: int = 5432
    DB_NAME: str = "postgres"
    
    @property
    def DATABASE_URL(self) -> str:
        if self.DIRECT_URL:
            # Ensure the scheme is postgresql+asyncpg
            url = self.DIRECT_URL.strip()
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        
        # Safely encode the password for the URI
        encoded_password = quote_plus(self.DB_PASSWORD.strip())
        return f"postgresql+asyncpg://{self.DB_USER.strip()}:{encoded_password}@{self.DB_HOST.strip()}:{self.DB_PORT}/{self.DB_NAME.strip()}"
    
    class Config:
        env_file = ".env"
        extra = "ignore"
        # Enable stripping whitespace automatically if possible, 
        # but the @property handles it explicitly now.

settings = Settings()
