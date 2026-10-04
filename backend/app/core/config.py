from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cafe Management API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520
    
    # Database
    DATABASE_URL: str
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # This tells Pydantic to read from the .env file
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

settings = Settings()